module Float exposing (roundTo, toHex, fromHex, interpolate)

import Int


roundTo : Int -> Float -> Float
roundTo dp num = let
    mult = toFloat (10 ^ dp)
  in
    (toFloat (Basics.round (num * mult))) / mult

toHex : Float -> String
toHex num = Int.toHex (round num)

fromHex : String -> Maybe Float
fromHex hex = Int.fromHex hex |> Maybe.map toFloat

interpolate : Float -> Float -> Float -> Float
interpolate percentage from to = from + (to - from) * percentage
