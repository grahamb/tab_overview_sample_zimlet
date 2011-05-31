/**
 * @fileoverview This zimlet provides an example of programmatically creating an overview (tree) in a tab zimlet).
 * Examples of extra functionality include getComputingId, getProxyTicket and createZimletDialog.
 * 
 * @author Graham Ballantyne hello@grahamballantyne.com
 * @version 1.0
 */

function com_grahamballantyne_taboverviewsample_app() {};

com_grahamballantyne_taboverviewsample_app.prototype = new ZmZimletBase();
com_grahamballantyne_taboverviewsample_app.prototype.constructor = com_grahamballantyne_taboverviewsample_app;


// ------ INIT AND APP CREATION ---------------------------------------------------------


/**
 * Init method
 * @public
 */
com_grahamballantyne_taboverviewsample_app.prototype.init = function() {
	this._tabsampleapp = this.createApp('Tab Overview Sample', 'GNB-panelIcon', 'Example of programmatically creating an overview (tree) in a tab zimlet.');
	
};



/**
 * AppLaunch runs the first time a tab is clicked
 * @public
 * @param {String} appName the application name
 */
com_grahamballantyne_taboverviewsample_app.prototype.appLaunch = function(appName) {
	switch(appName) {
		case this._tabsampleapp: {
			this.app = appCtxt.getCurrentApp();
			this._view = this.app.getController().getView();

			this.buildOverview();
			break;
		}
	}
};



/**
 * Runs each time the application is opened or closed (e.g. when tab is clicked into or away from)
 * 
 * @public
 * @param {String} appName the application name
 * @@param {String} active if true, the application status is open; otherwise false
 */
com_grahamballantyne_taboverviewsample_app.prototype.appActive = function(appName, active) {
	switch(appName) {
		case this._tabsampleapp: {
			if (active) {
				// do something when the tab is clicked
			} else {
				// do something when we switch to another tab
			}
			break;
		}
	}
};




// ------ OVERVIEW CREATION -------------------------------------------------------------

/**
 * Builds an tab overview tree view from an object literal of "folder items".
 * Folder items are grouped into Groups.
 * Each folder item can have an icon (or not) and an arbitrary number of subfolders.
 * Subfolder items can have an icon (or not) and an arbitrary number of subfolders (and so on...)
 * 
 * A group can have a handler function associated with it. The handler function receives click events on items within the folder group.
 * The handler function is specified in the folderGroup object literal as either a reference to an existing function or as an inline anonymous function.
 * 
 * @public
 */
com_grahamballantyne_taboverviewsample_app.prototype.buildOverview = function() {
	var activeApp = appCtxt.getCurrentApp()
	,	overview = activeApp ? activeApp.getOverview() : null
	,	overviewEl = overview.getHtmlElement();
	
	var folderGroups = [
		{
			name: "Group One",
			id: "tabsample_groupOne",
			//handler: this._groupOneHandler,
			handler: function(elId) {
				var msg = 'Handler is an inline anonymous function. <br/> You clicked an item in Group One with an ID of ' + elId
				,	dlg = appCtxt.getMsgDialog()
				,	style = DwtMessageDialog.INFO_STYLE;
				dlg.reset();
				dlg.setMessage(msg, style);
				dlg.popup();
			},
			folders: [
				{
					name: "Group One Item One",
					icon: null,
					id: "tabsample_groupOne_itemOne"
				},
				{
					name: "Group One Item Two",
					icon: null,
					id: "tabsample_groupOne_itemTwo"
				},
				{
					name: "Group One Item Three",
					icon: null,
					id: "tabsample_groupOne_itemThree"
				}
			]
		},
		{
			name: "Group Two",
			id: "tabsample_groupTwo",
			handler: this._groupTwoHandler,
			folders: [
				{
					name: "Group Two Item One",
					icon: "ImgMailApp",
					id: "tabsample_groupTwo_itemOne"
				},
				{
					name: "Group Two Item Two",
					icon: "ImgContactsApp",
					id: "tabsample_groupTwo_itemTwo"
				},
				{
					name: "Group Two Item Three",
					icon: "ImgCalendarApp",
					id: "tabsample_groupTwo_itemThree"
				}
			]
		},
		{
			name: "Group Three",
			id: "tabsample_groupThree",
			handler: this._groupThreeHandler,
			folders: [
				{
					name: "Group Three Item One",
					icon: null,
					id: "tabsample_groupThree_itemOne",
					subfolders: [
						{
							name: "Group Three Item One Sub One",
							icon: null,
							id: "tabsample_groupThree_itemOne_subOne"
						},
						{
							name: "Group Three Item One Sub Two",
							icon: null,
							id: "tabsample_groupThree_itemOne_subTwo",
							subfolders: {
								subSub1: {
									name: "Group Three Item On Sub Two SubSub One",
									icon: null,
									id: "tabsample_groupThree_itemOne_subTwo_subSubOne"
								},
								subSub2: {
									name: "Group Three Item On Sub Two SubSub Two",
									icon: null,
									id: "tabsample_groupThree_itemOne_subTwo_subSubTwo"
								}
							}
						},
						{
							name: "Group Three Item One Sub Three",
							icon: null,
							id: "tabsample_groupThree_itemOne_subThree"
						}
					]
				},
				{
					name: "Group Three Item Two",
					icon: null,
					id: "tabsample_groupThree_itemTwo"
				},
				{
					name: "Group Three Item Three",
					icon: null,
					id: "tabsample_groupThree_itemThree"
				}
			]
		}
	];
	
	overviewEl.innerHTML = '';
	
	for (var group in folderGroups) {
		var buildoverviewHtml = []
		,	i = buildoverviewHtml.length
		,	thisGroup = folderGroups[group];
		
		buildoverviewHtml[i++] = this._buildFolderGroupHtml(thisGroup);
		var folderGroupNode = document.createElement('div')
		,	id = folderGroups[group].id
		,	className = 'DwtComposite overviewFolderGroup';
		folderGroupNode.setAttribute('id', id);
		folderGroupNode.setAttribute('class', className);
		folderGroupNode.innerHTML = buildoverviewHtml.join('');
		var folderGroupClickHandler = thisGroup.handler ? thisGroup.handler : null;
		folderGroupNode.onclick = AjxCallback.simpleClosure(this._overviewClickHandler, thisGroup);
		overviewEl.appendChild(folderGroupNode);		
	}
};



/**
 * Creates the HTML for a folder group element in the tab zimlet overview tree view.
 * Recursively calls this._renderFoldersHtml for each folder (and subfolder) contained in the group.
 * 
 * @private
 * @see #com_grahamballantyne_taboverviewsample_app.prototype.buildOverview
 * @param {Object}	folderGroup		The individual folder group object
 * @returns HTML fragment
 * @type String
 */
com_grahamballantyne_taboverviewsample_app.prototype._buildFolderGroupHtml = function(folderGroup) {
	this.overviewHtml = [];
	this.__i = this.overviewHtml.length;
	// HEADER
	var headerId = Dwt.getNextId()
	,	fgTemplateData = {headerId: headerId, name: folderGroup.name};	
	
	this.overviewHtml[this.__i++] = AjxTemplate.expand("com_grahamballantyne_taboverviewsample.views.overview#folderGroup", fgTemplateData);
	
	// FOLDERS/ITEMS
	for (var folder in folderGroup.folders) {
		this._renderFoldersHtml(folderGroup.folders[folder]);
	}
	this.overviewHtml[this.__i++] = '</div>';
	return this.overviewHtml.join('');
};



/**
 * Called recursively by this._buildFolderGroupHtml to generate HTML for individual folder items and subfolders.
 * 
 * @private
 * @param {Object}	folder		Folder object
 * @param {Number} level		Indicates the level of indentation in subfolders. Only passed in by this function when it calls itself recursively.
 */
com_grahamballantyne_taboverviewsample_app.prototype._renderFoldersHtml = function(folder, level) {

	var collapsable = folder.hasOwnProperty('subfolders') ? true : false,
		level = level ? level : 1,
		id = folder.id ? folder.id : Dwt.getNextId();

	this.overviewHtml[this.__i++] = AjxTemplate.expand("com_grahamballantyne_taboverviewsample.views.overview#folderItemOpen", {id:id});
	
	if (collapsable) { var restoreLevel = level; level -= 1; }

	for (var i = level - 1; i >= 0; i--){
		this.overviewHtml[this.__i++] = AjxTemplate.expand("com_grahamballantyne_taboverviewsample.views.overview#folderItemLevel", {});
	};

	if (collapsable) {
		this.overviewHtml[this.__i++] = AjxTemplate.expand("com_grahamballantyne_taboverviewsample.views.overview#folderItemCollapsable", {id: Dwt.getNextId()});
	}

	if (folder.icon) {
		this.overviewHtml[this.__i++] = AjxTemplate.expand("com_grahamballantyne_taboverviewsample.views.overview#folderItemIcon", {icon: folder.icon});
	}

	this.overviewHtml[this.__i++] = AjxTemplate.expand("com_grahamballantyne_taboverviewsample.views.overview#folderItemClose", {name: folder.name});
	
	if (folder.subfolders) {
		level = restoreLevel ? restoreLevel : level;
		level += 1;  // level up!
		this.overviewHtml[this.__i++] = '<div class="containerGroup">';
		for (var sf in folder.subfolders) {
			this._renderFoldersHtml(folder.subfolders[sf], level);
		}
		this.overviewHtml[this.__i++] = "</div>";
	}

};



// ------ CLICK HANDLERS ----------------------------------------------------------------                                  

/**
 * Main click handler for overview items.
 * If the user clicked on a collapse/expand handle, collapse or expand the folder group.
 * If the user clicked something else AND a click handler was specified, run the handler, passing in the ID of the overview item.
 * 
 * @private
 * @param {Object} ev Event object
 * @param {Function} handlerFunc Click handler function
 */
com_grahamballantyne_taboverviewsample_app.prototype._overviewClickHandler = function(ev) {
	if (AjxEnv.isIE) {
		ev = window.event;
	}
	var dwtev = DwtShell.mouseEvent;
	dwtev.setFromDhtmlEvent(ev);
	var el = dwtev.target;
	var origTarget = dwtev.target;
	if (origTarget.className == "ImgNodeExpanded" || origTarget.className == "ImgNodeCollapsed") {

        while (el.className != "overviewHeader" &&  el.className != "DwtComposite") {
            el = el.parentNode;
        }
        var toHide = el.nextElementSibling;
        _myToggleElement(toHide);	
		
		if (origTarget.className == "ImgNodeExpanded") {
			origTarget.className = "ImgNodeCollapsed";
		} else {
			origTarget.className = "ImgNodeExpanded";
		}
	} else if (this.handler && origTarget.className !== 'overviewHeader-Text') {
		var elId;
		while (el && (el.className != 'DwtTreeItem')) {
			el = el.parentNode;
			elId = el.id;
		}
		
		this.handler(elId);
	}
};

// utility function
var _myToggleElement =  function (element) {
    if (element.style.display != 'none') {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

/**
 * Click handler for "folder group two". Displays a DwtMsgDialog showing the ID of the selected node.
 * 
 * @private
 * @param {String}	elId		ID of the node clicked on in the overview
 */
com_grahamballantyne_taboverviewsample_app.prototype._groupTwoHandler = function(elId) {
	var msg = 'You clicked an item in Group Two with an ID of ' + elId
	,	dlg = appCtxt.getMsgDialog()
	,	style = DwtMessageDialog.INFO_STYLE;
	dlg.reset();
	dlg.setMessage(msg, style);
	dlg.popup();
};



/**
 * Click handler for "folder group three". Displays a DwtMsgDialog showing the ID of the selected node.
 * 
 * @private
 * @param {String}	elId		ID of the node clicked on in the overview
 */
com_grahamballantyne_taboverviewsample_app.prototype._groupThreeHandler = function(elId) {
	var msg = 'You clicked an item in Group Three with an ID of ' + elId
	,	dlg = appCtxt.getMsgDialog()
	,	style = DwtMessageDialog.INFO_STYLE;
	dlg.reset();
	dlg.setMessage(msg, style);
	dlg.popup();
};



