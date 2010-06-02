/**
 * @fileoverview This zimlet provides an example of programmatically creating an overview (tree) in a tab zimlet).
 * Examples of extra functionality include getComputingId, getProxyTicket and createZimletDialog.
 * 
 * @author Graham Ballantyne hello@grahamballantyne.com
 * @version 1.0
 */
var ev;
function com_grahamballantyne_taboverviewsample_app() {};

com_grahamballantyne_taboverviewsample_app.prototype = new ZmZimletBase();
com_grahamballantyne_taboverviewsample_app.prototype.constructor = com_grahamballantyne_taboverviewsample_app;


// ------ INIT AND APP CREATION ---------------------------------------------------------


/**
 * Init method
 * @returns null
 */
com_grahamballantyne_taboverviewsample_app.prototype.init = function() {
	this._tabsampleapp = this.createApp('Tab Overview Sample', 'GNB-panelIcon', 'Example of programmatically creating an overview (tree) in a tab zimlet.');
	
};



/**
 * AppLaunch runs the first time a tab is clicked
 * @public
 * @param {String} appName the application name
 * @returns null
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
 * @public
 * @param {String} appName the application name
 * @@param {String} active if true, the application status is open; otherwise false
 * @returns null
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
 * Describe what this method does
 * @public
 * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
com_grahamballantyne_taboverviewsample_app.prototype.buildOverview = function() {
	var activeApp = appCtxt.getCurrentApp()
	,	overview = activeApp ? activeApp.getOverview() : null
	,	overviewEl = overview.getHtmlElement();
	
	var folderGroups = [
		{
			name: "Group One",
			id: "tabsample_groupOne",
			handler: this._groupOneHandler,
			folders: {
				item1: {
					name: "Group One Item One",
					icon: null,
					id: "tabsample_groupOne_itemOne"
				},
				item2: {
					name: "Group One Item Two",
					icon: null,
					id: "tabsample_groupOne_itemTwo"
				},
				item3: {
					name: "Group One Item Three",
					icon: null,
					id: "tabsample_groupOne_itemThree"
				}
			}
		},
		{
			name: "Group Two",
			id: "tabsample_groupTwo",
			handler: this._groupTwoHandler,
			folders: {
				item1: {
					name: "Group Two Item One",
					icon: "ImgMailApp",
					id: "tabsample_groupTwo_itemOne"
				},
				item2: {
					name: "Group Two Item Two",
					icon: "ImgContactsApp",
					id: "tabsample_groupTwo_itemTwo"
				},
				item3: {
					name: "Group Two Item Three",
					icon: "ImgCalendarApp",
					id: "tabsample_groupTwo_itemThree"
				}
			}
		},
		{
			name: "Group Three",
			id: "tabsample_groupThree",
			handler: this._groupThreeHandler,
			folders: {
				item1: {
					name: "Group Three Item One",
					icon: null,
					id: "tabsample_groupThree_itemOne",
					subfolders: {
						sub1: {
							name: "Group Three Item One Sub One",
							icon: null,
							id: "tabsample_groupThree_itemOne_subOne"
						},
						sub2: {
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
						sub3: {
							name: "Group Three Item One Sub Three",
							icon: null,
							id: "tabsample_groupThree_itemOne_subThree"
						}
					}
				},
				item2: {
					name: "Group Three Item Two",
					icon: null,
					id: "tabsample_groupThree_itemTwo"
				},
				item3: {
					name: "Group Three Item Three",
					icon: null,
					id: "tabsample_groupThree_itemThree"
				}
			}
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
		,	className = 'DwtComposite';
		folderGroupNode.setAttribute('id', id);
		folderGroupNode.setAttribute('class', className);
		folderGroupNode.innerHTML = buildoverviewHtml.join('');
		var folderGroupClickHandler = thisGroup.handler ? thisGroup.handler : null;
		folderGroupNode.onclick = AjxCallback.simpleClosure(this._overviewClickHandler, thisGroup);
		overviewEl.appendChild(folderGroupNode);		
	}
};



/**
 * Describe what this method does
 * @private
 * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
com_grahamballantyne_taboverviewsample_app.prototype._buildFolderGroupHtml = function(folderGroup) {
	this.overviewHtml = [];
	this.__i = this.overviewHtml.length;
	// HEADER
	var headerId = Dwt.getNextId();
	this.overviewHtml[this.__i++] = '<div class="overviewHeader">';
	this.overviewHtml[this.__i++] = '<table cellpadding="0" cellspacing="0">';
	this.overviewHtml[this.__i++] = '<tbody>';
	this.overviewHtml[this.__i++] = '<tr>';
	this.overviewHtml[this.__i++] = '<td style="width:16px;height:16px" align="center">';
	this.overviewHtml[this.__i++] = '<div class="ImgNodeExpanded" id="';	
	this.overviewHtml[this.__i++] = 'mysfu_expandIcon_';
	this.overviewHtml[this.__i++] = headerId;
	this.overviewHtml[this.__i++] = '"></div>';
	this.overviewHtml[this.__i++] = '</td>';
	this.overviewHtml[this.__i++] = '<td class="imageCell"></td>';
	this.overviewHtml[this.__i++] = '<td class="overviewHeader-Text">';
	this.overviewHtml[this.__i++] = folderGroup.name; 
	this.overviewHtml[this.__i++] = '</td>';
	this.overviewHtml[this.__i++] = '<td style="width:16px;height:16px">';
	this.overviewHtml[this.__i++] = '<div class="ImgBlank_16"></div>';
	this.overviewHtml[this.__i++] = '</td></tr></tbody></table></div>';
	
	// FOLDERS/ITEMS
	this.overviewHtml[this.__i++] = '<div class="containerGroup">';
	for (var folder in folderGroup.folders) {
		this._renderFoldersHtml(folderGroup.folders[folder]);
	}
	this.overviewHtml[this.__i++] = '</div>';
	return this.overviewHtml.join('');
};



/**
 * Describe what this method does
 * @private
 * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
com_grahamballantyne_taboverviewsample_app.prototype._renderFoldersHtml = function(folder, level) {

	var collapsable = folder.hasOwnProperty('subfolders') ? true : false,
		level = level ? level : 1,
		id = folder.id ? folder.id : Dwt.getNextId();

	this.overviewHtml[this.__i++] = '<div class="DwtComposite">';
	this.overviewHtml[this.__i++] = '<div class="DwtTreeItem" id="';
	this.overviewHtml[this.__i++] = id;
	this.overviewHtml[this.__i++] = '">';
	this.overviewHtml[this.__i++] = '<table width="100%" cellpadding="0" cellspacing="0"><tbody><tr>';

	if (collapsable) { var restoreLevel = level; level -= 1; }

	for (var i = level - 1; i >= 0; i--){
		this.overviewHtml[this.__i++] = '<td style="width:16px;height:16px" align="center">';
        this.overviewHtml[this.__i++] = '<div class="ImgBlank_16"></div>';
        this.overviewHtml[this.__i++] = '</td>';
	};

	if (collapsable) {
		// collapse handle; default to open (expanded)
		this.overviewHtml[this.__i++] = '<td style="width:16px;height:16px" align="center">';
		this.overviewHtml[this.__i++] = '<div class="ImgNodeExpanded" id="mysfu_expandIcon_';
		this.overviewHtml[this.__i++] =  Dwt.getNextId();
		this.overviewHtml[this.__i++] = '"></div>';
		this.overviewHtml[this.__i++] = '</td>';
	}

	if (folder.icon) {
		this.overviewHtml[this.__i++] = '<td style="width:16px;height:16px;padding-right:5px">';
		this.overviewHtml[this.__i++] = '<div class="';
		this.overviewHtml[this.__i++] = folder.icon;
		this.overviewHtml[this.__i++] = '"></div>';
		this.overviewHtml[this.__i++] = '</td>';

	}

	this.overviewHtml[this.__i++] = '<td class="DwtTreeItem-Text" nowrap="nowrap">';
	this.overviewHtml[this.__i++] = folder.name;
	this.overviewHtml[this.__i++] = '</td>';

	this.overviewHtml[this.__i++] = '<td style="width:16px;height:16px;padding-right:5px">';
	this.overviewHtml[this.__i++] = '<div class="ImgBlank_16"></div>';
	this.overviewHtml[this.__i++] = '</td>';
	this.overviewHtml[this.__i++] = '</tr>';
	this.overviewHtml[this.__i++] = '</tbody>';
	this.overviewHtml[this.__i++] = '</table>';
	this.overviewHtml[this.__i++] = '</div>';

	this.overviewHtml[this.__i++] = '</div>';

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
 * @private
 * @param {Object} ev Event object
 * @param {Function} handlerFunc Click handler function
 * @returns null
 */
com_grahamballantyne_taboverviewsample_app.prototype._overviewClickHandler = function(ev) {
	if (AjxEnv.isIE) {
		ev = window.event;
	}
	// debugger;
	var dwtev = DwtShell.mouseEvent;
	dwtev.setFromDhtmlEvent(ev);
	var el = dwtev.target;
	var origTarget = dwtev.target;
	if (origTarget.className == "ImgNodeExpanded" || origTarget.className == "ImgNodeCollapsed") {
		var toHide = $(el).parent().parentsUntil('.DwtComposite').parent().next().first();		
		toHide.toggle();
		if (origTarget.className == "ImgNodeExpanded") {
			origTarget.className = "ImgNodeCollapsed";
		} else {
			origTarget.className = "ImgNodeExpanded";
		}
	} else if (this.handler) {
		// find the item that was clicked
		while (el && el.className != 'DwtTreeItem') {
			el = el.parentNode;
		}
		
		this.handler(el.id);
	}
};

/**
 * Describe what this method does
 * @private
 * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
com_grahamballantyne_taboverviewsample_app.prototype._groupOneHandler = function(elId) {
	console.log('_groupOneHandler', elId);
};

/**
 * Describe what this method does
 * @private
 * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
com_grahamballantyne_taboverviewsample_app.prototype._groupTwoHandler = function(elId) {
	console.log('_groupTwoHandler', elId);
};

/**
 * Describe what this method does
 * @private
 * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
com_grahamballantyne_taboverviewsample_app.prototype._groupThreeHandler = function(elId) {
	console.log('_groupThreeHandler',elId);
};



