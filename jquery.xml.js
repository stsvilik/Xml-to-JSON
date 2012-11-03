/*
 * xml
 * https://github.com/stsvilik/xml-to-json
 * @author Sam Tsvilik
 *
 * Copyright (c) 2012 Sam Tsvilik
 * Licensed under the MIT, GPL licenses.
 */

(function(window, $, undef) {

  var NULL = null,
    FALSE = !1,
    TRUE = !0,
    NODE_TYPES = {
      Element: 1,
      Attribute: 2,
      Text: 3,
      CDATA: 4,
      Root: 9,
      Fragment: 11
    },
    XMLConverter, module;

  /**
   * Parses XML string and returns an XMLDocument object
   * @param  {String} strXML XML Formatted string
   * @return {XMLDocument|XMLElement}
   */

  function parseXMLString(strXML) {
    var xmlDoc = NULL,
      out = NULL,
      isParsed = TRUE;
    try {
      xmlDoc = ("DOMParser" in window) ? new DOMParser() : new ActiveXObject("MSXML2.DOMDocument");
      xmlDoc.async = FALSE;
    } catch (e) {
      throw new Error("XML Parser could not be instantiated");
    }

    if ("parseFromString" in xmlDoc) {
      out = xmlDoc.parseFromString(strXML, "text/xml");
      isParsed = (out.documentElement.tagName !== "parsererror");
    } else { //If old IE
      isParsed = xmlDoc.loadXML(strXML);
      out = (isParsed) ? xmlDoc : FALSE;
    }
    if (!isParsed) {
      throw new Error("Error parsing XML string");
    }
    return out;
  }

  XMLConverter = {
    isXML: function(o) {
        return (typeof(o) === "object" && o.nodeType !== undef);
    },
    getRoot: function(doc) {
        return (doc.nodeType === NODE_TYPES.Root) ? doc.documentElement : (doc.nodeType === NODE_TYPES.Fragment) ? doc.firstChild : doc;
    },
    /**
     * Begins the conversion process. Will automatically convert XML string into XMLDocument
     * @param  {String|XMLDocument|XMLNode|XMLElement} xml XML you want to convert to JSON
     * @return {JSON} JSON object representing the XML data tree
     */
    convert: function(xml) {
        var out = {}, xdoc = typeof(xml) === "string" ? parseXMLString(xml) : this.isXML(xml) ? xml : undef, root;
        if (!xdoc) {
            throw new Error("Unable to parse XML");
        }
        //If xdoc is just a text or CDATA return value
        if (xdoc.nodeType === NODE_TYPES.Text || xdoc.nodeType === NODE_TYPES.CDATA) {
            return xdoc.nodeValue;
        }
        //Extract root node
        root = this.getRoot(xdoc);
        //Create first root node
        out[root.nodeName] = {};
        //Start assembling the JSON tree (recursive)
        this.process(root, out[root.nodeName]);
        //Parse JSON string and attempt to return it as an Object
        return out;
    },
    /**
     * Recursive xmlNode processor. It determines the node type and processes it accordingly.
     * @param  {XMLNode} node Any XML node
     * @param  {Object} buff Buffer object which will contain the JSON equivalent properties
     */
    process: function(node, buff) {
      var child, attr, name, att_name, value, i, j, tmp, iMax;
        if(node.hasChildNodes()) {
            iMax = node.childNodes.length;
            for(i = 0; i < iMax; i++) {
                child = node.childNodes[i];
                //Check nodeType of each child node
                switch(child.nodeType) {
                case NODE_TYPES.Text:
                    //If parent node has both CDATA and Text nodes, we just concatinate them together
                    buff.Text = buff.Text ? buff.Text + $.trim(child.nodeValue) : $.trim(child.nodeValue);
                    break;
                case NODE_TYPES.CDATA:
                    //If parent node has both CDATA and Text nodes, we just concatinate them together
                    value = child[child.text ? "text" : "nodeValue"]; //IE attributes support
                    buff.Text = buff.Text ? buff.Text + value : value;
                    break;
                case NODE_TYPES.Element:
                    name = child.nodeName;
                    tmp = {};
                    //Node name already exists in the buffer and it's a NodeSet
                    if(name in buff) {
                        if(buff[name].length) {
                            this.process(child, tmp);
                            buff[name].push(tmp);
                        } else { //If node exists in the parent as a single entity
                            this.process(child, tmp);
                            buff[name] = [buff[name], tmp];
                        }
                    } else { //If node does not exist in the parent
                        this.process(child, tmp);
                        buff[name] = tmp;
                    }
                    break;
                }
            }
        }
        //Populate attributes
        if(node.attributes.length) {
            for(j = node.attributes.length - 1; j >= 0; j--) {
                attr = node.attributes[j];
                att_name = $.trim(attr.name);
                value = attr.value;
                buff["@" + att_name] = value;
            }
        }
    }
  };

  /**
   * Convert XML string or document to JSON
   * @param  {String|XMLDocument|XMLElement|XMLNode} xml Any type of XML
   * @return {Object}     JSON equivalent of the XML source
   */
  $.xmlToJSON = function(xml) {
    return XMLConverter.convert(xml);
  };
  
}(window, jQuery));