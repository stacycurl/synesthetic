module Canvas exposing (..)

import Html exposing (Html, text, li, div, span, ul, h1, section, button, input, label, a, main_, th, td, tr)
import Html.Attributes exposing (class, type_, href, src, style)
import Html.Events exposing (onClick)

import Events exposing (onMouseMove, MouseMoveEvent)
import Operations exposing (Operations)
import Square exposing (Square)
import Native.Canvas


type alias Model a =
  { square : Square a
  , operations : Operations a
  , size: Int
  , captureMovement : Bool
  , colourCaptured : Maybe a
  }

type Msg
  = Click
  | MouseMove MouseMoveEvent

update : Msg -> Model a -> (Model a, Cmd Msg)
update msg ({ captureMovement } as model) =
    case msg of
        Click ->
            ({ model | captureMovement = not captureMovement }, Cmd.none)

        MouseMove { offsetX, offsetY } ->
            let
                newModel = if (not captureMovement) then model else
                    { model | colourCaptured = Just <| colourAt model offsetX offsetY }
            in
                (newModel, Cmd.none)


view : Model a -> Html Msg
view { square } = Html.img
  [ src <| dataUrl square
  , style [("border", "1px solid")]
  , onClick Click
  , onMouseMove MouseMove
  ] []


colourAt : Model a -> Int -> Int -> a
colourAt { operations, square, size } x y =
    let
        (xf, yf, sf) = (toFloat x, toFloat y, toFloat size)
        xPercent = xf / (sf - 1.0)
        yPercent = (sf - 1.0) - yf / (sf - 1.0)
    in
        Square.colourAt operations xPercent yPercent square


dataUrl : Square a -> String
dataUrl s = "data:image/png;base64,"

addOne : Int -> Int
addOne = Native.Canvas.addOne
