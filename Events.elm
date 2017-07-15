module Events exposing (..)

import Json.Decode exposing (Decoder, map4, field, int)
import Html exposing (Attribute)
import Html.Events exposing (on)
import Html.Attributes exposing (map)


type alias MouseMoveEvent = { x: Int, y: Int, offsetX: Int, offsetY: Int }

onMouseMove : (MouseMoveEvent -> msg) -> Attribute msg
onMouseMove fn = on "mousemove" decodeMouseMoveEvent |> map fn


decodeMouseMoveEvent : Decoder MouseMoveEvent
decodeMouseMoveEvent =
    map4 MouseMoveEvent (field "x" int) (field "y" int) (field "offsetX" int) (field "offsetY" int)
