Xml-to-JSON
===========

Very simple utility to convert XML string or XMLDocument into a JSON object

Setup
---
Just include xml.js or xml.min.js on your page.

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