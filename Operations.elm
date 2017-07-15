module Operations exposing (Operations)


type alias Operations colour =
  { describe: colour -> String
  , roundTo: Int -> colour -> colour
  , interpolate: Float -> colour -> colour -> colour
  , map: (Float -> Float) -> colour -> colour
  , zipWith : (Float -> Float -> Float) -> colour -> colour -> colour
  }
