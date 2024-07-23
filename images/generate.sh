#!/bin/bash

# Uses ImageMagick to generate PNGs from SVGs
# brew install imagemagick
# Sizes are based on the Elgato style guide: https://docs.elgato.com/sdk/plugins/style-guide

# Category icons
magick -background none ./FermataIcon.svg -resize 28x28 "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/plugin/category.png"
magick -background none ./FermataIcon.svg -resize 56x56 "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/plugin/category@2x.png"

# Plugin icons
magick -background none ./FermataIcon.svg -resize 288x288 "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/plugin/plugin.png"
magick -background none ./FermataIcon.svg -resize 576x576 "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/plugin/plugin@2x.png"

# Volume icons
magick -background none ./volume-high-solid.svg -gravity center -extent "%[fx:max(w,h)]x%[fx:max(w,h)]" -resize 20x20 "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/actions/volume/icon.png"
magick -background none ./volume-high-solid.svg -gravity center -extent "%[fx:max(w,h)]x%[fx:max(w,h)]" -resize 40x40 "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/actions/volume/icon@2x.png"
magick -background none ./volume-high-solid.svg -resize 36x36 -gravity center -extent 72x72  "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/actions/volume/key.png"
magick -background none ./volume-high-solid.svg -resize 72x72 -gravity center -extent 144x144 "../dev.mantha.backgroundmusic-streamdeck.sdPlugin/imgs/actions/volume/key@2x.png"
