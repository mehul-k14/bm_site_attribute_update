var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');
var dir = File.IMPEX + '/src/attributesUpdate/';
var file = new File(dir + 'attributes.xml');
var fw = new FileWriter(file, 'UTF-8');
var xsw = new XMLStreamWriter(fw);



function generateXML(attr_infos, catalogId) {

    xsw.writeStartDocument('UTF-8', '1.0');
    xsw.writeStartElement("catalog");
    xsw.writeAttribute('xmlns', 'http://www.demandware.com/xml/impex/catalog/2006-10-31');
    xsw.writeAttribute('catalog-id',catalogId.trim());

    for (let index = 0; index < attr_infos.length; index++) {
        var element = attr_infos[index];


        xsw.writeStartElement("product");
        xsw.writeAttribute("product-id", element[0]);
        if (element[1].indexOf(',') > 0) {
            element[1] = element[1].trim();
            var arr = element[1].trim().split(',');
            for (var i = 0; i < arr.length; i++) {
                var ele = arr[i].trim();//site-id

                if (element[2] == "onlineFlag") {
                    xsw.writeStartElement("online-flag");
                    xsw.writeAttribute("site-id", ele.trim());
                }
                else if (element[2] == "searchable") {
                    xsw.writeStartElement("searchable-flag");
                    xsw.writeAttribute("site-id", ele.trim());
                }
                else if (element[2] == "facebookEnabled") {
                    xsw.writeStartElement("facebook-enabled-flag");
                    xsw.writeAttribute("site-id", ele.trim());
                }
                else if (element[2] == "pinterestEnabled") {
                    xsw.writeStartElement("pinterest-enabled-flag");
                    xsw.writeAttribute("site-id", ele.trim());
                }
                //value entry

                if (element[3] == "Yes")
                    xsw.writeCharacters("true");
                else
                    xsw.writeCharacters("false");


                xsw.writeEndElement();//attributes
            }

        }
        else {

            if (element[2] == "onlineFlag") {
                xsw.writeStartElement("online-flag");
                xsw.writeAttribute("site-id", element[1].trim());
            }
            else if (element[2] == "searchable") {
                xsw.writeStartElement("searchable-flag");
                xsw.writeAttribute("site-id", element[1].trim());
            }
            else if (element[2] == "facebookEnabled") {
                xsw.writeStartElement("facebook-enabled-flag");
                xsw.writeAttribute("site-id", element[1].trim());
            }
            else if (element[2] == "pinterestEnabled") {
                xsw.writeStartElement("pinterest-enabled-flag");
                xsw.writeAttribute("site-id", element[1].trim());
            }
            //value entry
            if (element[3] == "Yes")
                xsw.writeCharacters("true");
            else
                xsw.writeCharacters("false");

            xsw.writeEndElement();//attributes
        }
        xsw.writeEndElement();//product


    }
    xsw.writeEndElement();
    xsw.writeEndDocument();
    xsw.close();
    fw.close();

}

module.exports = {
    generateXML: generateXML
};