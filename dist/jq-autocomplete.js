(function ($) {
    var defaults = {
        treshold: 4,
        maximumItems: 5,
        highlightTyped: true,
        highlightClass: 'text-primary'
    };
    function createItem(lookup, item, opts) {
        var label;
        if (opts.highlightTyped) {
            var idx = item.label.toLowerCase().indexOf(lookup.toLowerCase());
            label = item.label.substring(0, idx)
                + '<span class="' + expandClassArray(opts.highlightClass) + '">' + item.label.substring(idx, idx + lookup.length) + '</span>'
                + item.label.substring(idx + lookup.length, item.label.length);
        }
        else {
            label = item.label;
        }
        return '<button type="button" class="dropdown-item" data-value="' + item.value + '">' + label + '</button>';
    }
    function expandClassArray(classes) {
        if (typeof classes == "string") {
            return classes;
        }
        if (classes.length == 0) {
            return '';
        }
        var ret = '';
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var clas = classes_1[_i];
            ret += clas + ' ';
        }
        return ret.substring(0, ret.length - 1);
    }
    function createItems(field, opts) {
        var lookup = field.val();
        if (lookup.length < opts.treshold) {
            hideDropdown(field);
            return 0;
        }
        var items = field.next();
        items.html('');
        var count = 0;
        var keys = Object.keys(opts.source);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var object = opts.source[key];
            var item = {
                label: opts.label ? object[opts.label] : key,
                value: opts.value ? object[opts.value] : object
            };
            if (item.label.toLowerCase().indexOf(lookup.toLowerCase()) >= 0) {
                items.append(createItem(lookup, item, opts));
                if (opts.maximumItems > 0 && ++count >= opts.maximumItems) {
                    break;
                }
            }
        }
        // option action
        field.next().find('.dropdown-item').click(function () {
            field.val($(this).text());
            if (opts.onSelectItem) {
                opts.onSelectItem({
                    value: $(this).data('value'),
                    label: $(this).text()
                }, field[0]);
            }
            hideDropdown(field);
        });
        return items.children().length;
    }
    function showDropdown(field) {
        field.next().css({ display: 'block' });
    }
    function hideDropdown(field) {
        field.next().css({ display: 'none' });
    }
    $.fn.autocomplete = function (options) {
        // merge options with default
        var opts = {};
        $.extend(opts, defaults, options);
        var _field = $(this);
        // clear previously set autocomplete
        _field.parent().find('.dropdown-menu').remove();
        // attach dropdown
        var dropdown = $('<div class="dropdown-menu"></div>');
        // attach dropdown class
        if (opts.dropdownClass)
            dropdown.addClass(opts.dropdownClass);
        dropdown.css({ position: 'absolute', top: _field.outerHeight(), left: 0, display: 'none' }); // styling for positioning
        _field.after(dropdown);
        this.off('click.autocomplete').click('click.autocomplete', function (e) {
            if (createItems(_field, opts) == 0) {
                hideDropdown(_field);
                e.stopPropagation();
            }
            else {
                showDropdown(_field);
            }
        });
        // show options on keyup
        this.off('keyup.autocomplete').keyup('keyup.autocomplete', function () {
            if (createItems(_field, opts) > 0) {
                showDropdown(_field);
            }
            else {
                hideDropdown(_field);
            }
        });
        // hide dropdown when clicking outside
        $(document).click(function (e) {
            if (!$(e.target).closest(_field).length) {
                hideDropdown(_field);
            }
        });
        return this;
    };
}(jQuery));
