function DomManipulator() {
  this.terminal      = document.getElementById("terminal");
  this.terminalInput = document.getElementById("terminal--input");
};

DomManipulator.prototype.getInputValue = function () {
  return this.terminalInput.value;
};

DomManipulator.prototype.setInputValue = function (value) {
  this.terminalInput.value = value;
};

DomManipulator.prototype.setFocusToInput = function () {
  this.terminalInput.focus();
};

DomManipulator.prototype.showOptionsList = function () {
  this.showSubmittedValue();
  this.createParagraph("<div class=\"uppercase mar-ver--sm\">Name </div>"
  + "<div class=\"pad-lft--md mar-ver--sm\"><b>map</b> -- Display actual map of nodes</div>"
  + "<div class=\"uppercase mar-ver--sm\">Synopsis </div>"
  + "<div class=\"pad-lft--md mar-ver--sm\"><b>map</b> [NODE_CODE ...]</div>"
  + "<div class=\"uppercase mar-ver--sm\">Description </div>"
  + "<div class=\"pad-lft--md wide mar-ver--sm\"><b>map</b> is a command to display actual map of nodes. The user must provide node codes [NODE_CODE] to include node details and hints on the map. "
  + "<br/><br/>The code structure is built of 5 hex values preceded with `0x`. "
  + "<br/><br/>There are 4 types of hints that can be shown on the map: [Sectors], [Target], [Traps] and [Connections]. "
  + "<br/><br/>The <b>map</b> command accepts multiple codes with or without preceded `0x`.</div>"
  + "<div class=\"uppercase mar-ver--sm\">Examples </div>"
  + "<div class=\"pad-lft--md mar-ver--sm\">The following is how to display map of nodes with [Target] and [Traps]</div>"
  + "<div class=\"pad-lft--lg mar-ver--sm\">map 0xEF4D0 B129A</div>"
  + "<br/><br/><div class=\"uppercase mar-ver--sm\">Name </div>"
  + "<div class=\"pad-lft--md mar-ver--sm\"><b>help</b> -- Display list of options</div>"
  + "<div class=\"uppercase mar-ver--sm\">Synopsis </div>"
  + "<div class=\"pad-lft--md mar-ver--sm\"><b>help</b></div>"
  + "<div class=\"uppercase mar-ver--sm\">Description </div>"
  + "<div class=\"pad-lft--md mar-ver--sm\"><b>help</b> is a command to display list of available options.</div>");
  this.setInputValue("");
};

DomManipulator.prototype.showCommandNotFound = function () {
  this.showSubmittedValue();
  this.createParagraph("<span class=\"uppercase\">Command not found: </span>" + this.getInputValue())
  this.setInputValue("");
};

DomManipulator.prototype.showMap = function (codes) {
  this.showSubmittedValue();
  let network = networkFromCodes(codes);
  // map 0xD1234 0xC16F8 0xEF4D0 0xB129A correct
  // map 0xF298E 0xEF4D0 0x1298E 0x44206 invalid
  this.createParagraph("<span class=\"uppercase\">Map of nodes: </span>");
  this.createParagraph(getNetworkMap(network) + this.prepareLegend(network), "terminal--map");
  this.showErrors(codes, network.errors);
  this.setInputValue("");
};

DomManipulator.prototype.showErrors = function (codes, errors) {
  if (codes.length === 1 && codes[0] === "") {
    this.createParagraph("Invalid empty code.");
    return;
  }
  if (!errors || !errors.length) return;

  let that = this;

  errors.forEach(function(error) {
    that.createParagraph(error);
  })
}

DomManipulator.prototype.prepareLegend = function (code) {
  let result = "<ul class=\"terminal--map-legend\">";
    if (code.colors && code.colors.length) {
      result = result + "<li class=\"color-springgreen\">Sectors: &#10003;</li>";
    } else {
      result = result + "<li class=\"color-red\">Sectors: &#10007;</li>";
    }

    if (code.target && code.target.length) {
      result = result + "<li class=\"color-springgreen\">Target: &#10003;</li>";
    } else {
      result = result + "<li class=\"color-red\">Target: &#10007;</li>";
    }

    if (code.traps) {
      result = result + "<li class=\"color-springgreen\">Traps: &#10003;</li>";
    } else {
      result = result + "<li class=\"color-red\">Traps: &#10007;</li>";
    }

    if (code.walls) {
      result = result + "<li class=\"color-springgreen\">Connections: &#10003;</li>";
    } else {
      result = result + "<li class=\"color-red\">Connections: &#10007;</li>";
    }

  return result + "</ul>";
};

DomManipulator.prototype.showSubmittedValue = function () {
  this.createParagraph("<span class=\"color-green\">> " + this.getInputValue() + "</span>");
};

DomManipulator.prototype.createParagraph = function (innerHtml, classNames = "", parentNode = this.terminal) {
  let p = document.createElement("p");
  p.setAttribute("class", classNames);
  p.innerHTML = innerHtml;
  parentNode.appendChild(p);
};

DomManipulator.prototype.scrollToBottom = function () {
  window.scrollTo(0, document.body.scrollHeight);
};
