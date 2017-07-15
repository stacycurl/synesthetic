module Square exposing(..)

import Operations exposing (Operations)


type alias Square a =
  { leftTop: a
  , rightTop: a
  , leftBottom: a
  , rightBottom: a
  , name: String
  }

operations : Operations a -> Operations (Square a)
operations aops =
  { describe    = describe aops
  , roundTo     = roundTo aops
  , interpolate = interpolate aops
  , map         = \fn -> map (aops.map fn)
  , zipWith     = \fn -> zipWith (aops.zipWith fn)
  }

squareAt : { ops | colourAt : Float -> Float -> a -> a }
        -> Float -> Float -> Float -> Float -> Square a -> Square a
squareAt { colourAt } xStart xEnd yStart yEnd { leftTop, rightTop, leftBottom, rightBottom, name } =
    { leftTop     = colourAt xStart yStart leftTop
    , rightTop    = colourAt xEnd   yStart rightTop
    , leftBottom  = colourAt xStart yEnd   leftBottom
    , rightBottom = colourAt xEnd   yEnd   rightBottom
    , name        = name
    }

rotate : Int -> Square a -> Square a
rotate amount s = case (amount + 4) % 4 of
    0 -> s
    n -> rotate (n - 1) <| create s.leftBottom s.leftTop s.rightBottom s.rightTop s.name


xMirror : Square a -> Square a
xMirror s = create s.rightTop s.leftTop s.rightBottom s.leftBottom s.name


colourAt : Operations a -> Float -> Float -> Square a -> a
colourAt { interpolate } xPercent yPercent { leftTop, rightTop, leftBottom, rightBottom, name } =
    let
        left  = interpolate yPercent leftBottom  leftTop
        right = interpolate yPercent rightBottom rightTop
    in
        interpolate xPercent left right

left : Square a -> List a
left { leftTop, leftBottom } = [leftTop, leftBottom]

right : Square a -> List a
right { rightTop, rightBottom } = [rightTop, rightBottom]

top : Square a -> List a
top { leftTop, rightTop } = [leftTop, rightTop]

bottom : Square a -> List a
bottom { leftBottom, rightBottom } = [leftBottom, rightBottom]

corners : Square a -> List a
corners square = top square ++ bottom square

describe : Operations a -> Square a -> String
describe _ _ = "foo"

roundTo : Operations a -> Int -> Square a -> Square a
roundTo { roundTo } dp = map <| roundTo dp

interpolate : Operations a -> Float -> Square a -> Square a -> Square a
interpolate { interpolate } percentage = zipWith <| interpolate percentage

map : (a -> b) -> Square a -> Square b
map fn { leftTop, rightTop, leftBottom, rightBottom, name } =
  create (fn leftTop) (fn rightTop) (fn leftBottom) (fn rightBottom) name

zipWith : (a -> b -> c) -> Square a -> Square b -> Square c
zipWith fn a b =
  { leftTop     = fn a.leftTop     b.leftTop
  , rightTop    = fn a.rightTop    b.rightTop
  , leftBottom  = fn a.leftBottom  b.leftBottom
  , rightBottom = fn a.rightBottom b.rightBottom
  , name        = "zipWith(" ++ a.name ++ ", " ++ b.name ++ ")"
  }

create : a -> a -> a -> a -> String -> Square a
create leftTop rightTop leftBottom rightBottom name =
    { leftTop     = leftTop
    , rightTop    = rightTop
    , leftBottom  = leftBottom
    , rightBottom = rightBottom
    , name = name
    }
