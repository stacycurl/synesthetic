module LCH exposing (LCH, describe, roundTo, interpolate, zipWith, map, operations)

import Float
import Operations exposing (Operations)


type alias LCH = {   l: Float,     c: Float,    h: Float }


operations : Operations LCH
operations =
  { describe    = describe
  , roundTo     = roundTo
  , interpolate = interpolate
  , map         = map
  , zipWith     = zipWith
  }




describe : LCH -> String
describe { l, c, h } =
  "LCH(" ++ (toString l) ++ ", " ++ (toString c) ++ ", " ++ (toString h) ++ ")"


roundTo : Int -> LCH -> LCH
roundTo dp = map (Float.roundTo dp)


interpolate : Float -> LCH -> LCH -> LCH
interpolate percentage from to =
    let
        diff = to.h - from.h

        (fromH, toH) =
          if abs diff <= 180
            then (from.h, to.h)
          else if diff > 0
            then (from.h + 360, to.h)
          else
            (from.h, to.h + 360)
    in
        { l = Float.interpolate percentage from.l to.l
        , c = Float.interpolate percentage from.c to.c
        , h = Float.interpolate percentage fromH toH
        }



zipWith : (Float -> Float -> Float) -> LCH -> LCH -> LCH
zipWith fn left right =
  { l = fn left.l right.l
  , c = fn left.c right.c
  , h = fn left.h right.h
  }

map : (Float -> Float) -> LCH -> LCH
map fn { l, c, h } = { l = fn l, c = fn c, h = fn h }
