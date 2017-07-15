module Util exposing (sequence)


sequence : List (Maybe a) -> Maybe (List a)
sequence list =
    let
        justs = List.filterMap identity list
    in
        if List.length justs == List.length list then Just justs else Nothing
