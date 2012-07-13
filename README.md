Xml-to-JSON
===========

Very simple utility to convert XML string or XMLDocument into a JSON object

Setup
---
Just include xml.js or xml.min.js on your page.

About the output
---
As we all know XML and JSON are different. Not only in verbosity, but also in the way data is store and represented. This utility does it's best to output JSON structure as close as possible to the source, but there are things you should know about, so here we go.

* **Handling node attributes** - In XML attributes are stored as part of the node tag and thus allow for their names to be the same as node names (i.e \<name name="sam"/\>), this is considered a valid XML, in JSON however this would mean a big no-no, because matching names would simply overwrite each other. To avoid this confilct, all attribute names are prefixed with "@" sign. - Ex.  \<name name="sam"/\> => {"name":{"@name":"sam"}};

* **Handling node value and CDATA** - Node value is the Text between the open/close of a tag, however there are cases where node may contain CDATA element in addition to just text value (i.e. \<node\>Hello<![CDATA[ World]]>\</node\>). in this example we don't want to loose any content, so converter will concatinate values of both Text and CDATA nodes. These values will be accessible through a "Text" property. - Ex. \<node\>Hello<![CDATA[ World]]>\</node\> => {"node":{"Text":"Hello World"}}.

* **Root node handling** - Converter will create a root node element at the top of the JSON structure. - Ex. \<root\>\<node\>Hello<![CDATA[ World]]>\</node\>\</root\> => {"root":{"node":{"Text":"Hello World"}}}.

#### Examples
Using with string XML

	var strXML = "<root>" +
			"<group>" +
				"<item name="test1">test data 1</item>"+
				"<item name="test2">test data 2</item>"+
				"<item name="test3">test data 3</item>"+
			"</group>"+
		"</root>";
		jsonData = xml.xmlToJSON(strXML);
		console.dir(jsonData);
		console.log(JSON.stringify(jsonData));

Using with AJAX data

	$.ajax({
		url: "data/file.xml",
		dataType:"xml"
	}).done(function(xmlData){
		var jsonData = xml.xmlToJSON(xmlData);
		console.dir(jsonData);
		console.log(JSON.stringify(jsonData));
	});

Using as AJAX dataFilter

	$.ajax({
		url: "data/file.xml",
		dataType:"xml",
		dataFilter: xml.xmlToJSON
	}).done(function(jsonData){
		console.dir(jsonData);
		console.log(JSON.stringify(jsonData));
	});