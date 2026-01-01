require "/scripts/util.lua"
require "/scripts/augments/item.lua"

function paletteSwapDirective(color)
  local directive, keys = "replace", {}
  for key in pairs(color) do 
    table.insert(keys, key) 
  end
  table.sort(keys)
  for _,key in ipairs(keys) do
    directive = directive .. ";" .. key .. "=" .. color[key]
  end
  return directive
end

function getColorOptions(dyeable)
  local options = {}
  for _,color in ipairs(dyeable:instanceValue("colorOptions", {})) do
    if type(color) == "string" then
      table.insert(options, color)
    else
      table.insert(options, paletteSwapDirective(color))
    end
  end
  return options
end

function getDirectives(dyeable)
  local directives = dyeable:instanceValue("directives", "")
  if directives == "" then
    local colorOptions = getColorOptions(dyeable)
    if #colorOptions > 0 then
      local colorIndex = dyeable:instanceValue("colorIndex", 0)
      directives = "?" .. util.tableWrap(colorOptions, colorIndex + 1)
    end
  end
  return directives
end

function isArmor(item)
  local armors = {
      headarmor = true,
      chestarmor = true,
      legsarmor = true,
      backarmor = true
    }
  return armors[item:type()] == true
end

function apply(input)
  local output = Item.new(input)

  if not isArmor(output) then
    return nil
  end

  local dyeColorIndex = config.getParameter("dyeColorIndex")
  local dyeDirectives = config.getParameter("dyeDirectives")

  local currentDirectives = getDirectives(output)
  
  if dyeColorIndex then
    local colorOptions = getColorOptions(output)
    if not isEmpty(colorOptions) then
      dyeDirectives = "?" .. util.tableWrap(colorOptions, dyeColorIndex + 1)
      
      return recolor(output, currentDirectives, dyeDirectives, dyeColorIndex)
    end

  elseif dyeDirectives then
    if type(dyeDirectives) == "table" then
      dyeDirectives = "?" .. paletteSwapDirective(dyeDirectives)
    end

    return recolor(output, currentDirectives, dyeDirectives)
  end
end



function checkModsFor(name) -- no clue if there's a non-oSB way to do this
  local modlist = root.assetSourcePaths and root.assetSourcePaths(true)
  for _,v in pairs(modlist or {}) do
    if v.name == name then
      return true 
    end
  end
  return false
end

function recolor(output, fullDirectives, newDyeDirectives, dyeColorIndex)
  -- custom clothing
  if string.find(fullDirectives, "%?crop") then
    local customDyeDirectivesSignal = "?scale=1.00;"
    
    local customDyeDirectivesPosition = string.find(fullDirectives, customDyeDirectivesSignal)
    local currentCustomDyeDirectives = customDyeDirectivesPosition 
     and string.sub(fullDirectives, customDyeDirectivesPosition) 
     or ""

    if customDyeDirectivesSignal .. newDyeDirectives ~= currentCustomDyeDirectives then
      output:setInstanceValue("colorIndex", dyeColorIndex)
      output:setInstanceValue("directives", fullDirectives:gsub(currentCustomDyeDirectives:gsub("%?", "%%?"), "") .. customDyeDirectivesSignal .. newDyeDirectives)
      
      local flipDirectives = output:instanceValue("flipDirectives", "")
      if flipDirectives ~= "" then
        local customDyeFlipDirectivesPosition = string.find(flipDirectives, customDyeDirectivesSignal)
        local currentCustomDyeFlipDirectives = customDyeFlipDirectivesPosition
         and string.sub(flipDirectives, customDyeFlipDirectivesPosition) 
         or ""
        output:setInstanceValue("flipDirectives", flipDirectives:gsub(currentCustomDyeFlipDirectives:gsub("%?", "%%?"), "") .. customDyeDirectivesSignal .. newDyeDirectives)
      end

      return output:descriptor(), checkModsFor("XRC_INFAUGMENTS") and 0 or 1
    end

  -- non-custom clothing
  elseif newDyeDirectives ~= fullDirectives then
    output:setInstanceValue("colorIndex", dyeColorIndex)
    if dyeColorIndex then
      output:setInstanceValue("directives", nil)
    else
      output:setInstanceValue("directives", newDyeDirectives)
    end

    return output:descriptor(), checkModsFor("XRC_INFAUGMENTS") and 0 or 1
  end
end