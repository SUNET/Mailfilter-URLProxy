function hs(x, modhelp, hide_text, show_text) {
    id = "el-" + x;
    c = document.getElementById(id);
    if (modhelp) {
	d = document.getElementById(x);
    }
    if (c.style.display == "none") {
	c.style.display = "block";
	if (modhelp) {
	    d.removeChild(d.childNodes[0]);
	    d.appendChild(document.createTextNode("(" + hide_text + ")"));
	}
    } else {
	c.style.display = "none";
	if (modhelp) {
	    d.removeChild(d.childNodes[0]);
	    d.appendChild(document.createTextNode("(" + show_text + ")"));
	}
    }
}

function hide_show_rows(prefix, from, to, show_style, master, open_text, closed_text) {
    // Make sure prefix is a string
    prefix = "" + prefix;
    for (i=from; i<=to; i++) {
	c = document.getElementById(prefix + i);
	if (c.style.display == "none") {
	    try {
		c.style.display = show_style;
	    } catch(err) {
		c.style.display = "block";
	    }
	} else {
	    c.style.display = "none";
	}
    }
    if (master != "") {
	d = document.getElementById(master);
	if (d) {
	    cn = d.childNodes[0].childNodes[0];
	    if (cn.nodeValue == open_text) {
		cn.nodeValue = closed_text;
	    } else {
		cn.nodeValue = open_text;
	    }
	}
    }
}

function rp_enable(element) {
    thing = document.getElementById(element);
    thing.disabled = false;
}

function rp_disable(element) {
    thing = document.getElementById(element);
    thing.disabled = true;
}

function hs_origins(count, showtext, hidetext) {
    hide_show_rows("os-", 1, count, "inline", "", "1", "0");
    c = document.getElementById("os-button");
    if (c) {
	if (c.value == showtext) {
	    c.value = hidetext;
	} else {
	    c.value = showtext;
	}
    }
}

function validate_del () {
    var num_checked;
    num_checked = $("input.del:checked").length;
    if (num_checked == 0) {
	return true;
    }
    if (num_checked == 1) {
	return confirm("Delete the item?");
    } else {
	return confirm("Delete the " + num_checked + " items?");
    }
}

function del_do_strikethru (cb) {
    if (cb.checked) {
	$("#s_" + cb.name).addClass("to-delete");
    } else {
	$("#s_" + cb.name).removeClass("to-delete");
    }
}

function disable_input_item(cb) {
    if (cb.checked) {
	$("#__id" + cb.id).attr('disabled', 'disabled');
    } else {
	$("#__id" + cb.id).attr('disabled', '');
	$("#__id" + cb.id).removeAttr('disabled');
    }
}

function verify_reject_all_as_spam(widget_type, text) {
    if (widget_type == "Checkbox") {
	return verify_reject_all_as_spam_checkbox(text);
    } else {
	return verify_reject_all_as_spam_pulldown(text);
    }
}

function verify_reject_all_as_spam_pulldown (text) {
    var el = document.dispose.elements;
    for (c=0; c<el.length; c++) {
	if (el[c].type == "select-one") {
	    var i = el[c].selectedIndex;
	    if (el[c].options[i].value != 'do-nothing' && el[c].options[i].value != 'reject') {
		return confirm(text);
	    }
	}
    }
    return true;
}

function verify_reject_all_as_spam_checkbox(text) {
    var el = document.dispose.elements;
    for (c=0; c<el.length; c++) {
	if (el[c].type == "radio") {
	    if (el[c].checked && el[c].value == "allow") {
		return confirm(text);
	    }
	}
    }
    return true;
}

function country_update(name) {
    $("#" + name).val($("#cses" + name).val());
    $("#cses" + name).val('...');
}

function make_upper(x) {
    x.value = x.value.toUpperCase();
}

function human_number (x, decimals) {
    if (!decimals) {
	decimals = 0;
    }
    var suffix = '';
    var y;
    if (x >= 1000000000) {
	x = x / 1000000000.0;
	suffix = 'G';
    } else if (x >= 1000000) {
	x = x / 1000000.0;
	suffix = 'M';
    } else if (x >= 1000) {
	x = x / 1000.0;
	suffix = 'K';
    }
    if (decimals >= 0) {
	x = 1 * x.toFixed(decimals);
	x = x.toString();
	return x + suffix;
    }
    y = Math.abs(Math.floor(x)) + "";
    decimals = (-1 * decimals) - y.length;
    if (decimals < 0) {
	decimals = 0;
    }
    x = 1 * x.toFixed(decimals);
    x = x.toString();
    return x + suffix;
}

function weekend_flot_helper(axes)
{
    var markings = [];
    var d = new Date(axes.xaxis.min);
    // go to the first Saturday
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
    d.setUTCSeconds(0);
    d.setUTCMinutes(0);
    d.setUTCHours(0);
    var i = d.getTime();
    do {
        // when we don't set yaxis, the rectangle automatically
        // extends to infinity upwards and downwards
        markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
        i += 7 * 24 * 60 * 60 * 1000;
    } while (i < axes.xaxis.max);
    return markings;
}
