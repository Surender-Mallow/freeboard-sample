// https://github.com/leon-van-dongen/freeboard-table
(function()
{
    //Setting white-space to normal to override gridster's inherited value
    freeboard.addStyle('table.list-table', "width: 100%; white-space: normal !important; ");
    freeboard.addStyle('table.list-table td, table.list-table th', "padding: 2px 2px 2px 2px; vertical-align: top; text-align: center;");
    freeboard.addStyle('li.scroller_enable', "overflow-y: scroll !important;");

    var tableWidget = function (settings) {
        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<div><table class="list-table"><thead><tr><th>Date Time</th><th>Boiler 1</th><th>Boiler 2</th><th>Boiler 3</th><th>Boiler 4</th><th>Boiler 5</th></tr></thead><tbody/></table></div>');
        var currentSettings = settings;
        //store our calculated values in an object
        var stateObject = {};

        function updateState() {

            $('.list-table').parents('.sub-section').css('overflow-y', 'scroll');
            $('.list-table').parents('.gridster').css('overflow-y', 'scroll');

            //only proceed if we have a valid JSON object
            if (stateObject.value) {

                var templateRow = $('<tr/>');
                var rowHTML;

                rowHTML = templateRow.clone();

                console.log(stateObject);
                try {
                    $.each(stateObject.value, function(valueKey, value){
                        console.log(value, valueKey);
                        if (valueKey == 0) {
                            rowHTML.append('<td>' + moment(value).format('MMMM Do YYYY, h:mm:ss a') + '</td>');
                        } else {
                            rowHTML.append('<td style="color: ' + findClass(value, 25, 40) + '">' + value + '</td>');
                        }
                    })
                } catch (e) {
                    console.log(e);
                }

                // rowHTML.append('<td">' + new Date() + '</td>');
                // rowHTML.append('<td style="color: ' + findClass(stateObject.value1, 25, 40) + '">' + stateObject.value1 + '</td>');
                // rowHTML.append('<td style="color: ' + findClass(stateObject.value2, 50, 60) + '">' + stateObject.value2 + '</td>');
                // rowHTML.append('<td style="color: ' + findClass(stateObject.value3, 15, 40) + '">' + stateObject.value3 + '</td>');
                // rowHTML.append('<td style="color: ' + findClass(stateObject.value4, 45, 60) + '">' + stateObject.value4 + '</td>');
                // rowHTML.append('<td style="color: ' + findClass(stateObject.value5, 30, 80) + '">' + stateObject.value5 + '</td>');

                stateElement.find('tbody').append(rowHTML);

                //show or hide the header based on the setting
                if (currentSettings.show_header) {
                    stateElement.find('thead').show();
                } else {
                    stateElement.find('thead').hide();
                }
            }
        }

        function findClass(value, min, max) {
            if (value > max) {
                return 'red';
            } else if (value > min && value < max) {
                return 'orange'
            } else {
                return 'green';
            }
        }

        this.render = function (element) {
            $(element).append(titleElement).append(stateElement);
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            // updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            //whenver a calculated value changes, stored them in the variable 'stateObject'
            stateObject[settingName] = newValue;
            updateState();
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return currentSettings.blocks;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "list",
        display_name: "Table",external_scripts: [
            "plugins/thirdparty/moment.js"
        ],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "show_header",
                display_name: "Show Headers",
                default_value: true,
                type: "boolean"
            },
            {
                name: "blocks",
                display_name: "Height (No. Blocks)",
                type: "number",
                default_value: 4
            },
            {
                name: "value",
                display_name: "Data",
                type: "calculated"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new tableWidget(settings));
        }
    });
}());