function impl() {
  var div = document.createElement('div');
  var main = Elm.Main.embed(div);

  main.ports.substitutePageResponse.subscribe(function(response) {
    console.log("Response", response);
  });

  main.ports.sF.send("Foo");

  var options = new Options()

  // painful to get many...
  options.substitutionStyle.get(function(result) {
    var substitutor = new Substitutor(result)

    substitutor.apply()
  });
}
