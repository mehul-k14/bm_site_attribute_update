var controller_flag;
var name_to_id = [];
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

jQuery('#attributeselect > vscomp-toggle-button > div').change(function (params) {
    var selected_ids = jQuery('#productselect input').val();
    var selected_attr = jQuery('#attributeselect').val();

    jQuery('.ids_selected input').val(selected_ids);


    VirtualSelect.init({
        ele: '#attr_selected',
        options: selected_attr

    });
})

function getselectedAttr() {

    var selected_ids = jQuery('#productselect input').val();
    var selected_attr = jQuery('#attributeselect').val();

    jQuery('.ids_selected input').val(selected_ids);
    jQuery('#attr_selected').empty();
    for (let index = 0; index < selected_attr.length; index++) {
        const element = selected_attr[index];
        jQuery('#attr_selected').append(`<option>${element}</option>`);

    }

}

jQuery(document).on('click', '.submit-ids', function () {
    jQuery('#data_selected').removeClass('d-none');
})

function update_status(product_status, idx) {
    if (product_status.isOnline) {
        jQuery('.online_flag_' + idx).attr('checked');
    }
    if (product_status.isSearchable) {
        jQuery('.searchable_' + idx).attr('checked');

    }


}

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
    var dataSet = [
        ['Tiger Nixon', 'System Architect', 'Edinburgh', '5421'],
        ['Garrett Winters', 'Accountant', 'Tokyo', '8422'],
        ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '1562'],
        ['Cedric Kelly', 'Senior Javascript Developer', 'Edinburgh', '6224'],
        ['Airi Satou', 'Accountant', 'Tokyo', '5407'],
        ['Brielle Williamson', 'Integration Specialist', 'New York', '4804'],
        ['Tiger Nixon', 'System Architect', 'Edinburgh', '5421'],
        ['Garrett Winters', 'Accountant', 'Tokyo', '8422'],
        ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '1562'],
        ['Cedric Kelly', 'Senior Javascript Developer', 'Edinburgh', '6224'],
        ['Airi Satou', 'Accountant', 'Tokyo', '5407'],
        ['Brielle Williamson', 'Integration Specialist', 'New York', '4804']
    ];
    $('#example').empty();
    $('#example').DataTable().destroy();
    $('#example').DataTable({
        data: dataSet,
        "lengthChange": false,
        "pageLength": 10,
        columns: [
            { title: 'Product_ID' },
            { title: 'Site_ID' },
            { title: 'Attributes' },
            { title: 'Value' }
        ],
    });

    controller_flag = 0;
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
            data: productIds,
            controller_flag: controller_flag
        }

        jQuery.ajax({
            url: jQuery('.productIds').attr('data-action'),
            type: 'get',
            dataType: 'json',

            success: function (data) {
                console.log("inside success");
                document.querySelector('#attributeselect').destroy();
                var attrbuteArr = [];
                for (let index = 0; index < data.obj.length; index++) {
                    if (data.obj[index].site_specific) {
                        const disp_name = data.obj[index].display_name.default;
                        const disp_id = data.obj[index].effective_id;
                        attrbuteArr.push(disp_name);
                        //creating a map to get id from the name 
                        name_to_id.push({ disp_name: disp_id });
                    }
                }
                VirtualSelect.init({
                    ele: '#attributeselect',
                    options: attrbuteArr

                });
            },
            error: function (data) {
                console.log("Inside error");
            }

        });
        jQuery.ajax({

            url: jQuery('.searchbar').attr('data-action'),
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(formData),

            success: function (data) {
                if (data.flag) {
                    alert("The product id/s at position " + data.index + " are invalid");
                }
                else {

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
                alert('inside error');

            }
        });


    }
}

function submitData() {
    controller_flag = 1;

    var productIds = jQuery(".productIds").val();
    productIds = productIds.trim();
    productIds = productIds.split(",")
    var len = productIds.length;

    var SiteNames = jQuery("body").find(".SiteIds").val();
    SiteNames = SiteNames.trim();
    SiteNames = SiteNames.split(',');
    SiteNames[0] = SiteNames[0].replace('[', '');
    SiteNames[SiteNames.length - 1] = SiteNames[SiteNames.length - 1].replace(']', '');
    var n = SiteNames.length;
    var productData = [];

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < n; j++) {
            var isSearchable = false;
            var isOnline = false;
            if (jQuery(`.searchable_${j}`).is(":checked")) {
                isSearchable = true;
                console.log(isSearchable);
            }
            if (jQuery(`.online_flag_${j}`).is(":checked")) {
                isOnline = true;
                console.log(isOnline);
            }
            productData.push({
                pid: productIds[i],
                SiteName: SiteNames[j],
                isSearchable: isSearchable,
                isOnline: isOnline
            });
        }

    }
    var formData = {
        data: productData,
        controller_flag: controller_flag,
        pid_len: len,
        Site_len: n
    }
    jQuery.ajax({

        url: jQuery('.table_container').attr('data-action'),
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(formData),

        success: function (data) {
            console.log("success");
        },
        error: function (data) {
            console.log("error");
        }
    });



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

    $('#example').dataTable({
        bSort: false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "info": true,
        "paging": true
    });
});

function SubmitData() {
    var selected_sites = jQuery('#siteselect input').val();
    var attr_selected = jQuery('#attr_selected input').val();
    var ids_selected = jQuery('.ids_selected input').val();

    if (attr_selected == 'Searchable' || 'Searchable if Unavailable' || 'Online' || 'Included' || 'Pinterest Enabled' || 'Facebook Enabled') {
        attr_values

        bool_attr = ['None', 'Yes', 'No'];
        VirtualSelect.init({
            ele: '.attr_values',
            options: bool_attr

        });
    }
}
