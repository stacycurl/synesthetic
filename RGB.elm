module RGB exposing (
    RGB, white, black, red, green, blue, cyan, yellow, magenta,
    describe, toHex, fromHex,
    roundTo, interpolate,
    zipWith, map, operations
  )

import Float
import Regex exposing (Regex, HowMany(..), find, regex, caseInsensitive)
import Operations exposing (Operations)


type alias RGB = { red: Float, green: Float, blue: Float }

operations : Operations RGB
operations =
  { describe    = describe
  , roundTo     = roundTo
  , interpolate = interpolate
  , map         = map
  , zipWith     = zipWith
  }


white = { red = 255.0, green = 255.0, blue = 255.0 }
black = { red = 0.0,   green = 0.0,   blue = 0.0   }

red   = { red = 255.0, green = 0.0,   blue = 0.0   }
green = { red = 0.0,   green = 255.0, blue = 0.0   }
blue  = { red = 0.0,   green = 0.0,   blue = 255.0 }

cyan    = { red = 0.0,   green = 255.0, blue = 255.0 }
magenta = { red = 255.0, green = 0.0,   blue = 255.0 }
yellow  = { red = 255.0, green = 255.0, blue = 0.0   }


describe : RGB -> String
describe { red, green, blue} =
  "RGB(" ++ (toString red) ++ ", " ++ (toString green) ++ ", " ++ (toString blue) ++ ")"

toHex : RGB -> String
toHex { red, green, blue } =
  let
      hex = (Float.toHex >> String.padLeft 2 '0')
  in
      "#" ++ (hex red) ++ (hex green) ++ (hex blue)

fromHex : String -> Maybe RGB
fromHex hex =
    let
        pattern : Regex
        pattern = caseInsensitive <| regex <| "^#([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$"

        submatches : List String
        submatches = find All pattern hex |> List.concatMap .submatches |> List.filterMap identity

        floats : List (Maybe Float)
        floats = submatches |> List.map Float.fromHex
    in
        case floats of
          [Just red, Just green, Just blue] -> Just { red = red, green = green, blue = blue }
          _                                 -> Nothing



roundTo : Int -> RGB -> RGB
roundTo dp { red, green, blue } =
  { red   = Float.roundTo dp red
  , green = Float.roundTo dp green
  , blue  = Float.roundTo dp blue
  }

interpolate : Float -> RGB -> RGB -> RGB
interpolate percentage = zipWith (Float.interpolate percentage)


zipWith : (Float -> Float -> Float) -> RGB -> RGB -> RGB
zipWith fn left right =
  { red   = fn left.red   right.red
  , green = fn left.green right.green
  , blue  = fn left.blue  right.blue
  }

map : (Float -> Float) -> RGB -> RGB
map fn { red, green, blue} = { red = fn red, green = fn green, blue = fn blue }
