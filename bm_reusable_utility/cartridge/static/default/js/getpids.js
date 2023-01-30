var name_to_id = new Map();
$(function () {

    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");

    $("a[data-modal-id]").click(function (e) {
        e.preventDefault();
        $("body").append(appendthis);
        $(".modal-overlay").fadeTo(500, 0.7);
        //$(".js-modalbox").fadeIn(500);
        var modalBox = $(this).attr('data-modal-id');
        $("#" + modalBox).fadeIn($(this).data());
    });

    $(".js-modal-close, .modal-overlay").click(function () {
        $(".modal-box, .modal-overlay").fadeOut(500, function () {
            $(".modal-overlay").remove();
        });
    });

    $(window).resize(function () {
        $(".modal-box").css({
            top: ($(window).height() - $(".modal-box").outerHeight()) / 3,
            left: ($(window).width() - $(".modal-box").outerWidth()) / 5.5
        });
    });

    $(window).resize();

});



function cloneRow(e) {
    var $tr = jQuery(e).closest('tr');
    var $clone = $tr.clone();
    $tr.after($clone);

}

function removeRow(e) {
    var rowCount = jQuery('#tblProductUpdate tr').length;
    if (rowCount > 2) {
        var $tr = jQuery(e).closest('tr');
        var $clone = $tr.remove();
    }
}


function getData() {
    //disabling button
    // document.getElementById("editButton").disabled = true;
    // document.getElementById("editButton").style.pointerEvents = "none";
    jQuery(".tbody_data").remove();
    jQuery(".table_head").remove();
    var productIds = jQuery(".productIds").val();
    var validate = true;
    if (productIds === '') {
        alert("Plese provide valid input");
        validate = false;
    }

    if (validate) {

        jQuery(document).on('click', '.submit-ids', function () {
            jQuery('.submit_data').removeClass('d-none');
        })
        productIds = productIds.trim();
        productIds = productIds.split(",");

        for (let i = 0; i < productIds.length; i++) {
            if (productIds[i] === '') {
                productIds.splice(i, 1);
            }
        }
        var formData = {
            data: productIds
        }

        jQuery.ajax({
            url: jQuery('.productIds').attr('data-action'),
            type: 'get',
            dataType: 'json',
            data: { data: JSON.stringify(formData) },

            success: function (data) {

                if (data.flag) {
                    alert("The product id/s at position " + data.index + " are invalid");
                }

                else {

                    jQuery('#data_selected').removeClass('d-none');
                    console.log("inside success");
                    document.querySelector('#attributeselect').destroy();
                    var attrbuteArr = [];

                    for (let index = 0; index < data.obj.length; index++) {
                        if (data.obj[index].site_specific && data.obj[index].value_type === 'boolean') {
                            const disp_name = data.obj[index].display_name.default;
                            const disp_id = data.obj[index].effective_id;

                            attrbuteArr.push(disp_name);
                            //creating a map to get id from the name 
                            name_to_id.set(disp_name, disp_id);
                        }
                    }
                    VirtualSelect.init({
                        ele: '#attributeselect',
                        options: attrbuteArr

                    });



                    // new code

                    var rowCount = jQuery('#tblProductUpdate tr').length;
                    if (rowCount > 2) {
                    }
                    var SiteNames = jQuery("body").find(".SiteIds").val();
                    SiteNames = SiteNames.trim();
                    SiteNames = SiteNames.split(',');
                    SiteNames[0] = SiteNames[0].replace('[', '');
                    SiteNames[SiteNames.length - 1] = SiteNames[SiteNames.length - 1].replace(']', '');

                    var productArr = [];
                    var siteArr = [];

                    for (var id = 0; id < productIds.length; id++) {
                        item = {}
                        item["label"] = productIds[id];
                        item["value"] = productIds[id];
                        productArr.push(item);
                    }
                    for (let i = 0; i < SiteNames.length; i++) {
                        siteitem = {}
                        siteitem["label"] = SiteNames[i];
                        siteitem["value"] = SiteNames[i];
                        siteArr.push(siteitem);
                    }
                    // ajax to get attribute definitions.


                    document.querySelector('#productselect').destroy();
                    document.querySelector('#siteselect').destroy();
                    // document.querySelector('#attributeselect').destroy();



                    VirtualSelect.init({
                        ele: '#productselect',
                        options: productArr

                    });
                    VirtualSelect.init({
                        ele: '#siteselect',
                        options: siteArr

                    });

                    $('.table_button_' + id).append('<div class="site-data"><button type="submit">Submit</button></div></div>');
                    console.log("endd");
                }

            },
            error: function (data) {
                console.log("Inside error");
            }

        });

    }
}

var dataSet = [];
var array = [];


function getselectedAttr() {
    // selecting values 
    var selected_ids = jQuery('#productselect input').val();
    var selected_attr = jQuery('#attributeselect').val();
    var selected_sites = jQuery('#siteselect input').val();

    if (selected_ids == "" || selected_attr.length == 0 || selected_sites === "") {
        alert("Please select all the fields to proceed");
    }
    else {
        //appending values
        jQuery('.ids_selected input').val(selected_ids);
        jQuery('#attr_selected').empty();
        jQuery('#attr_selected').append(`<option>Select</option>`);

        for (let index = 0; index < selected_attr.length; index++) {
            const element = selected_attr[index];
            jQuery('#attr_selected').append(`<option>${element}</option>`);

        }
    }

}

function SubmitData() {
    var selected_sites = jQuery('#siteselect input').val();
    var attr_selected = jQuery('#attr_selected').val();
    var ids_selected = jQuery('.ids_selected input').val();
    var attr_value = jQuery('#attr_values').val();
    var catalogId = jQuery(".catalogId").val();
    // checking catalog id
    jQuery.ajax({
        url: jQuery('.check_catalog').attr("data-action"),
        type: "post",
        data: { data: JSON.stringify(catalogId) },

        success: function (data) {
            if (data.flag)
                alert("Please enter a correct Catalog id")
            else {
                if (attr_selected == null || attr_value == null || selected_sites == '' || ids_selected == '')
                    alert("Please select attibute and it's value.");
                else {
                    var data = [];
                    if (ids_selected.indexOf(',') > 0) {
                        console.log("yes");
                        ids_selected = ids_selected.split(",");
                        // for multiple products and multiple sites
                        if (selected_sites.indexOf(',') > 0) {
                            selected_sites = selected_sites.split(",");
                            count = 0;
                            for (let index = 0; index < ids_selected.length; index++) {
                                const element = ids_selected[index];
                                for (let idx = 0; idx < selected_sites.length; idx++) {
                                    const ele = selected_sites[idx];

                                    data[count] = [element, ele, attr_selected, attr_value];
                                    count++;
                                }

                            }
                        }
                        // for single product and multiple sites
                        else {
                            for (let index = 0; index < ids_selected.length; index++) {
                                const element = ids_selected[index];

                                data[index] = [element, selected_sites, attr_selected, attr_value];

                            }
                        }

                    }
                    else {
                        console.log("no ,");
                        // for single product and multiple sites
                        if (selected_sites.indexOf(',') > 0) {
                            selected_sites = selected_sites.split(",");

                            for (let index = 0; index < selected_sites.length; index++) {
                                const element = selected_sites[index];

                                data.push([ids_selected, element, attr_selected, attr_value]);
                            }

                        }
                        // for single product and mulriple sites
                        else {
                            data.push([ids_selected, selected_sites, attr_selected, attr_value]);
                        }
                    }

                    array = array.concat(dataSet.concat(data));
                    var dup = [];
                    var arrOfstr = [];
                    if (array.length > 0) {
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];

                            var ele = (array[index][0] + array[index][1] + array[index][2]).toString();

                            arrOfstr.push(ele);
                            if (index > 0) {
                                for (let i = 0; i < arrOfstr.length - 1; i++) {
                                    if (arrOfstr[i] === ele)
                                        dup.push(i);
                                }
                            }
                        }
                    }

                    for (let i = 0; i < dup.length; i++) {
                        array.splice(dup[i], 1);
                    }

                    $('#example').empty();
                    $('#example').DataTable().destroy();
                    $('#example').DataTable({
                        data: array,
                        "searching": false,
                        paging: true,
                        "lengthChange": false,
                        "pageLength": 10,
                        columns: [
                            { title: 'Product_ID' },
                            { title: 'Site_ID' },
                            { title: 'Attributes' },
                            { title: 'Value' }
                        ],
                    });

                }


            }
        },
        error: function (data) {
            alert("Error while checking catalog id");
        }


    });

    //


    $('#example').empty();
    $('#example').DataTable().destroy();
    $('#example').DataTable({
        data: array,
        "searching": false,
        paging: true,
        "lengthChange": false,
        "pageLength": 10,
        columns: [
            { title: 'Product_ID' },
            { title: 'Site_ID' },
            { title: 'Attributes' },
            { title: 'Value' }
        ],
    });
    jQuery('.submit-tabledata').removeClass('d-none');
}

function SubmitTableData() {

    var catalogId = jQuery(".catalogId").val();

    if (array.length > 0) {
        for (let index = 0; index < array.length; index++) {
            const element = array[index][2];
            array[index][2] = name_to_id.get(element);
        }
        array.push(catalogId.trim());
        jQuery.ajax({
            url: jQuery('.submit-tabledata').attr('data-action'),
            type: 'post',
            data: { data: JSON.stringify(array) },

            success: function (data) {
                alert(data.data.msg);
                array = [];
                arrOfstr = [];
                dup = [];
                $('#example').empty();
                $('#example').DataTable().destroy();
                $('#example').DataTable({
                    paging: true,
                    "searching": false,
                    "lengthChange": false,
                    "pageLength": 10,
                    columns: [
                        { title: 'Product_ID' },
                        { title: 'Site_ID' },
                        { title: 'Attributes' },
                        { title: 'Value' }
                    ],
                });
                // jQuery('.submit-tabledata').addClass('d-none');

                // jQuery('#example_wrapper').addClass('d-none');
            },
            error: function (data) {
                alert("Error while updating");
            }

        });
    }
    else {
        alert("Please Fill the table to proceed")
    }
}

function selectValue() {
    bool_attr = ['Yes', 'No'];
    jQuery('#attr_values').empty();
    jQuery('#attr_values').append(`<option>Select</option>`);
    for (let index = 0; index < bool_attr.length; index++) {
        const element = bool_attr[index];
        jQuery('#attr_values').append(`<option>${element}</option>`);
    }
}

$(document).ready(function () {


    VirtualSelect.init({
        ele: '#productselect'
    });
    VirtualSelect.init({
        ele: '#siteselect'
    });
    VirtualSelect.init({
        ele: '#attributeselect'
    });

    $('#example').DataTable({
        data: [],
        bSort: false,
        paging: false,
        searching: false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "info": true,
        "paging": false
    });
});



