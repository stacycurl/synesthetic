module Colours exposing (
    toLCH, toRGB
  )

import Float
import RGB exposing (RGB)
import LCH exposing (LCH)




toLCH : RGB -> LCH
toLCH = rgb_to_xyz >> xyz_to_lab >> lab_to_lch

toRGB : LCH -> RGB
toRGB = lch_to_lab >> lab_to_xyz >> xyz_to_rgb




type alias XYZ = { x: Float, y: Float, z: Float }
type alias LAB = { l: Float, a: Float, b: Float }


rgb_to_xyz : RGB -> XYZ
rgb_to_xyz { red, green, blue} =
    let
        calc i = (if i > 0.04045 then ((i + 0.055) / 1.055) ^ 2.4 else i / 12.92) * 100.0

        varR = calc <| red   / 255.0
        varG = calc <| green / 255.0
        varB = calc <| blue  / 255.0
    in
        { x = varR * 0.4124 + varG * 0.3576 + varB * 0.1805
        , y = varR * 0.2126 + varG * 0.7152 + varB * 0.0722
        , z = varR * 0.0193 + varG * 0.1192 + varB * 0.9505
        }

xyz_to_rgb : XYZ -> RGB
xyz_to_rgb { x, y, z} =
    let
        (varX, varY, varZ) = (x / 100.0, y / 100.0, z / 100.0)

        calc i = if (i > 0.0031308) then (1.055 * (i ^ (1.0 / 2.4)) - 0.055) else (12.92 * i)

        varR = calc <| varX *  3.2406 + varY * -1.5372 + varZ * -0.4986
        varG = calc <| varX * -0.9689 + varY *  1.8758 + varZ *  0.0415
        varB = calc <| varX *  0.0557 + varY * -0.2040 + varZ *  1.0570

        bound = clamp 0.0 255.0
    in
        { red   = bound (varR * 255.0)
        , green = bound (varG * 255.0)
        , blue  = bound (varB * 255.0)
        }

xyz_to_lab : XYZ -> LAB
xyz_to_lab { x, y, z} =
    let
        calc i = if i > 0.008856 then i ^ (1.0 / 3.0) else (7.787 * i) + (16.0 / 116.0)

        varX = calc <| x /  95.047
        varY = calc <| y / 100.0
        varZ = calc <| z / 108.883
    in
        { l = if varY > 0.008856 then (116.0 * varY) - 16.0 else 903.3 * varY
        , a = 500.0 * (varX - varY)
        , b = 200.0 * (varY - varZ)
        }

lab_to_lch : LAB -> LCH
lab_to_lch { l, a, b } =
    let
        tanBA = atan2 b a
        varH = if tanBA > 0.0
               then (tanBA / pi) * 180.0
               else 360.0 - (abs tanBA / pi) * 180.0
    in
        { l = l
        , c = sqrt <| (a ^ 2) + (b ^ 2)
        , h = varH
        }

lab_to_xyz : LAB -> XYZ
lab_to_xyz { l, a, b } =
    let
        calc i = if (i ^ 3.0) > 0.008856 then (i ^ 3.0) else (i - 16.0 / 116.0) / 7.787

        (refX, refY, refZ) = (95.047, 100.0, 108.883)

        y = (l + 16.0) / 116.0
        varY = calc y
        varX = calc <| (a / 500.0) + y
        varZ = calc <| y - (b / 200.0)
    in
        { x = refX * varX
        , y = refY * varY
        , z = refZ * varZ
        }

lch_to_lab : LCH -> LAB
lch_to_lab { l, c, h } =
    let
        hradi = h * (pi / 180.0)
    in
        { l = l
        , a = (cos hradi) * c
        , b = (sin hradi) * c
        }
