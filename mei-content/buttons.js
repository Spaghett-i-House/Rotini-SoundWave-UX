var hidden = {
	"sideNav": true,
	"resSlider": true,
	"palletescontainer": true,
	"newpalletecontainer": true
}

// Showing and hiding settings
function oc_hide() {
	const resSlider = document.querySelector("#resSlider");
	// Hide
	if (!hidden.sideNav) {
    	document.querySelector(".sidenav").style.right = "-200px";
		hidden["sideNav"] = true;

    	for (var key in hidden) {
    		if (key != "sideNav") {
	    		hidden[key] = true;
	    		console.log(document.querySelector("#" + key));
	    		document.querySelector("#" + key).style.opacity = "0%";    			
    		}
    	}
	}
	// Show
	else {
    	document.querySelector(".sidenav").style.right = 0;
		hidden["sideNav"] = false;
	}
}

// Showing and hiding resolution
function oc_showhideitem(item) {
	const el = document.querySelector("#" + item);
	if (!hidden[item]) {
    	el.style.opacity = "0";
	    setTimeout(function() {
	        el.style.display = "none";
	    }, 200);
		hidden[item] = true;
	}
	else {
    	el.style.display = "block";
	    setTimeout(function() {
    		el.style.opacity = "100";
	    }, 1);
		hidden[item] = false;
	}
}

// Changing resolution
function oi_resolution() {
   const rVal = document.querySelector("#resRange").value;
   changeRes(rVal);
}

// Changing current pallete
function oc_palletes() {
   const pVal = document.querySelector("#palletes").value;
   preset = presetCols[pVal];
}

// Adding new pallete
function oc_newpalletecontainer() {
	const pn = document.querySelector("#palName");
	const c1 = document.querySelector("#col1");
	const c2 = document.querySelector("#col2");
	var valid = true;

	// Invalid name
	if (!pn.value) {
		valid = false;
		pn.placeholder = "ENTER NAME";
		pn.value = "";
	}
	// Invalid hex
	if (!validHex(c1.value)) {
		valid = false;
		c1.placeholder = "INVALID HEX";
		c1.value = "";
	}
	// Invalid value
	if (!validHex(c2.value)) {
		valid = false;
		c2.placeholder = "INVALID HEX";
		c2.value = "";
	}

	if (valid) {
		// Add new preset
		presetCols[pn.value] = {
			col1: rgbaNorm(c1.value),
			col2: rgbaNorm(c2.value)
		}
		var newPreset = document.createElement("OPTION");
		newPreset.value = pn.value;
		newPreset.textContent = pn.value;
		document.querySelector("#palletes").appendChild(newPreset);
		// Reset text
		pn.placeholder = "Name";
		pn.value = "";
		c1.placeholder = "Hex Code 1";
		c1.value = "";
		c2.placeholder = "Hex Code 2";
		c2.value = "";
	}
}