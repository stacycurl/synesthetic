module Int exposing (toHex, fromHex, toDigits, fromDigits)

import Dict exposing (Dict)
import Util exposing (sequence)


toHex : Int -> String
toHex num = (toDigits 16 num) |> List.filterMap digitToHex |> String.fromList


fromHex : String -> Maybe Int
fromHex hex =
    let
        digits : Maybe (List Int)
        digits = String.toList hex |> List.map hexToDigit |> sequence
    in
        Maybe.map (fromDigits 16) digits


toDigits : Int -> Int -> List Int
toDigits base number =
    let
        recurse number = if number < base then [number] else
            let
                digit = number % base
            in
                digit :: recurse ((number - digit) // base )
    in
        recurse number |> List.reverse

fromDigits : Int -> List Int -> Int
fromDigits base digits =
    let
        recurse digits factor acc = case digits of
            digit :: rest -> recurse rest (factor * base) acc + (factor * digit)
            [] -> acc
    in
        recurse (List.reverse digits) 1 0


digitToHex : Int -> Maybe Char
digitToHex = flip Dict.get <| Dict.fromList pairs

hexToDigit : Char -> Maybe Int
hexToDigit = pairs |> List.map (\(d, c) -> (c, d)) |> Dict.fromList |> flip Dict.get

pairs : List (Int, Char)
pairs =
  [ (0, '0')
  , (1, '1')
  , (2, '2')
  , (3, '3')
  , (4, '4')
  , (5, '5')
  , (6, '6')
  , (7, '7')
  , (8, '8')
  , (9, '9')
  , (10, 'A')
  , (11, 'B')
  , (12, 'C')
  , (13, 'D')
  , (14, 'E')
  , (15, 'F')
  ]
