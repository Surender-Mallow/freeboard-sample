// https://github.com/leon-van-dongen/freeboard-table
(function()
{
    //Setting white-space to normal to override gridster's inherited value
    freeboard.addStyle('table.list-table', "width: 100%; white-space: normal !important; ");
    freeboard.addStyle('table.list-table td, table.list-table th', "padding: 10px 0px 10px 0px; vertical-align: top; text-align: center; font-size: 18px; font-weight: bold;");
    freeboard.addStyle('table.list-table th', "color: rgba(255,255,255,0.65); ");
    freeboard.addStyle('table.list-table tr td:first-child', "color: #ffffff; ");
    freeboard.addStyle('[data-sizey="10"] .widget', "padding: 0px !important");
    freeboard.addStyle('li.scroller_enable', "overflow-y: scroll !important;");
    freeboard.addStyle('tbody tr:nth-child(odd)',"background-color: rgba(255,255,255, 0.1)");

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

                try {
                    $.each(stateObject.value, function(valueKey, value){
                        if (valueKey == 0) {
                            rowHTML.append('<td>' + moment(value).format('DD MMM YY, h:mm:ss a') + '</td>');
                        } else {
                            rowHTML.append('<td style="color: ' + findClass(value, 25, 40) + '">' + value + '</td>');
                        }
                    })
                } catch (e) {
                    console.log(e);
                }

                stateElement.find('tbody').prepend(rowHTML);

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
                return '#ff073a';
            } else if (value > min && value < max) {
                return 'yellow'
            } else {
                return '#00FF00';
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