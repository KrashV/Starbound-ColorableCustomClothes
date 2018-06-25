require "/scripts/util.lua"
require "/scripts/augments/item.lua"

function paletteSwapDirective(color)
  local directive = "replace"
  for key,val in pairs(color) do
    directive = directive .. ";" .. key .. "=" .. val
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

function recolor(output, currentDirectives, dyeDirectives, dyeColorIndex)
  local customDirectiveMinLength = 4500
  local customDyeDirectiveSignal = "?scale=1.00;"
  local customDirectivesPositionStart, customDirectivesPositionEnd = string.find(currentDirectives, customDyeDirectiveSignal)
  
  
  if customDirectivesPositionStart and customDirectivesPositionEnd then
	  local currentDyeDirectives = customDirectivesPositionEnd + 1 < string.len(currentDirectives) 
		and string.sub(currentDirectives, customDirectivesPositionEnd + 1) 
		or ""
	  if dyeDirectives ~= currentDyeDirectives then
		output:setInstanceValue("colorIndex", dyeColorIndex)
		output:setInstanceValue("directives", string.sub(currentDirectives, 1, customDirectivesPositionEnd) .. dyeDirectives)

		return output:descriptor(), 1
	  end
  elseif string.len(currentDirectives) > customDirectiveMinLength then
	output:setInstanceValue("colorIndex", dyeColorIndex)
	output:setInstanceValue("directives", currentDirectives .. customDyeDirectiveSignal .. dyeDirectives)
	return output:descriptor(), 1
  else
	  if dyeDirectives ~= currentDirectives then
		output:setInstanceValue("colorIndex", dyeColorIndex)
		output:setInstanceValue("directives", "")

		return output:descriptor(), 1
	  end	  
  end
end

function apply(input)
  local output = Item.new(input)

  if not isArmor(output) then
    return nil
  end

  local dyeColorIndex = config.getParameter("dyeColorIndex")
  local dyeDirectives = config.getParameter("dyeDirectives")

  local colorOptions = getColorOptions(output)
  local currentDirectives = getDirectives(output)
  
  if dyeColorIndex then
    if not isEmpty(colorOptions) then
      dyeDirectives = "?" .. util.tableWrap(colorOptions, dyeColorIndex + 1)
	  return recolor(output, currentDirectives, dyeDirectives, dyeColorIndex)
    end

  elseif dyeDirectives then
    if type(dyeDirectives) == "table" then
      dyeDirectives = "?" .. paletteSwapDirective(dyeDirectives)
    end
	return recolor(output, currentDirectives, dyeDirectives, dyeColorIndex)
  end
end
