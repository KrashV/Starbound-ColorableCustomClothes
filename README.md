# Starbound-ColorableCustomClothes
A starbound mod for coloring the custom clothes.

## Prerequirements
The mod is designed to work with [Silverfeelin's Outfit Generator](https://github.com/Silverfeelin/Starbound-OutfitGenerator)'s output. Click the link and follow the instructions.

## Installation
Download the [latest release](https://github.com/KrashV/Starbound-ColorableCustomClothes/releases) and put it in your starbound `mods` folder.

## Usage

### Designing your armor
To make your custom clothes dyeable, make sure to color them with the default Starbound palette: the most common colors are #ffca8a ![#ffca8a](https://placehold.it/15/ffca8a/000000?text=+), #e0975c ![#e0975c](https://placehold.it/15/e0975c/000000?text=+), #a85636 ![#a85636](https://placehold.it/15/a85636/000000?text=+) and #6f2919 ![#6f2919](https://placehold.it/15/6f2919/000000?text=+).

### Editing the default color schemes
You can change the correlation between the dye and the applied color by editing the ``colorOptions`` table of the item. ``colorOptions`` is an array of color palettes, where each palette is presented by string-hex code pair, where key is the default value of the item and value is the overriding color.

If you don't want to create the table manually, you can try [a web version](https://krashv.github.io/Starbound-ColorableCustomClothes/)

*COMMENTARIES MUST BE OMITTED*
```json5
"colorOptions" : [
    // DEFAULT (DYE REMOVER)
    { "ffca8a" : "b5b5b5", "e0975c" : "808080", "a85636" : "555555", "6f2919" : "303030" },
    // BLACK
    { "ffca8a" : "838383", "e0975c" : "555555", "a85636" : "383838", "6f2919" : "151515" },
    // GREY
    { "ffca8a" : "b5b5b5", "e0975c" : "808080", "a85636" : "555555", "6f2919" : "303030" },
    // WHITE
    { "ffca8a" : "e6e6e6", "e0975c" : "b6b6b6", "a85636" : "7b7b7b", "6f2919" : "373737" },
    // RED
    { "ffca8a" : "f4988c", "e0975c" : "d93a3a", "a85636" : "932625", "6f2919" : "601119" },
    // ORANGE
    { "ffca8a" : "ffd495", "e0975c" : "ea9931", "a85636" : "af4e00", "6f2919" : "6e2900" },
    // YELLOW
    { "ffca8a" : "ffffa7", "e0975c" : "e2c344", "a85636" : "a46e06", "6f2919" : "642f00" },
    // GREEN
    { "ffca8a" : "b2e89d", "e0975c" : "51bd3b", "a85636" : "247824", "6f2919" : "144216" },
    // BLUE
    { "ffca8a" : "96cbe7", "e0975c" : "5588d4", "a85636" : "344495", "6f2919" : "1a1c51" },
    // PURPLE
    { "ffca8a" : "d29ce7", "e0975c" : "a451c4", "a85636" : "6a2284", "6f2919" : "320c40" },
    // PINK
    { "ffca8a" : "eab3db", "e0975c" : "d35eae", "a85636" : "97276d", "6f2919" : "59163f" },
    // BROWN
    { "ffca8a" : "ccae7c", "e0975c" : "a47844", "a85636" : "754c23", "6f2919" : "472b13" }
  ]
  ```
  
  ### Custom dye
  You can also create your own dye, modifying  the following parameters of the dye item:
  *COMMENTARIES MUST BE OMITTED*
  ```json5
  {
    // ESSENTIAL TO LET THE SCRIPT KNOW THAT THE DYE HAS CUSTOM VALUES
    "dyeColorIndex": false,
    
    // CRIMSON (Made by Unxie)
    "dyeDirectives": { "a85636" : "640023", "e0975c" : "9B0036", "6f2919" : "330012", "ffca8a" : "D20049"}
  }
  ```
  
  ## Issues
  Let me know if you encounter and bug or can think of an enchantment!
