# Zimbra Tab Zimlet Overview Tree Sample (com\_grahamballantyne\_taboverviewsample)

Github repo: [http://github.com/grahamb/tab\_overview\_sample\_zimlet](http://github.com/grahamb/tab_overview_sample_zimlet)

Forum post: []()

## The Problem

Zimbra Collaboration Suite version 6.0 (ZCS6) introduced the concept of a 'tab zimlet' -- a zimlet that resides as an application tab at the top of the window, a la Mail, Calendar, etc. These zimlets primairly have two areas: a main view on the right and an overview area on the left. The most common use of the overview area is to display a folder tree, like that in the Mail app. The [Social Zimlet](http://gallery.zimbra.com/type/zimlet/social-zimlet) it a good example of this pattern (see [http://img.skitch.com/20100603-fhnqpdeyh9g2tm2b4m9cxqaijq.png](http://img.skitch.com/20100603-fhnqpdeyh9g2tm2b4m9cxqaijq.png) for a screenshot).

![social zimlet screenshot](http://img.skitch.com/20100603-rdk7prae435cgqqwu4xy1r293r.png)

A frequent question on the Zimbra forums has been "how do I create a overview tree?" I have been working on a tab zimlet for our Zimbra installation and I had the same question. The [Zimlet Developer's Guide](http://wiki.zimbra.com/wiki/ZCS_6.0:Zimlet_Developers_Guide:Introduction) is silent on this issue. After doing some poking around in the Zimbra source and the Social Zimlet, I discovered the following:

* The Dwt toolkit contains methods for creating trees and tree items (DwtTree.js and DwtTreeItem.js). These appear to be used by the 'first-party applications' (e.g. Mail, Calendar)
* The Dwt methods (like all of Dwt) are poorly documented.
* Zimbra's own tab zimlets (e.g. Social, Broadsoft) do not use the Dwt framework for creating trees; rather, they have hard-coded HTML which mimics the same structure.

I'm not a big fan of hard-coding HTML into JavaScript; it makes for ugly code and is inflexible. For example, there's no good way to programmatically manipulate the tree once it has been rendered. Also, it's hard to generate a tree from dynamically-generated data (e.g. a chunk of JSON retrieved from a remote server). I knew there must be a better way, so I set out to build it.

## The Solution

I like JSON and using object literals to describe data. A folder structure can be easily defined in an object literal:

`var folderGroups = [
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
];`

The above object literal would generate a tree that looks like [this](http://img.skitch.com/20100603-nutb5b2c3625x5gdf9i3ccbqmp.png):

![sample zimlet screenshot](http://img.skitch.com/20100603-j7pg8xwjwr14i9xx5yppp6uejk.png)

Folder Groups are an object containing a number of folders/items, each of which can have a number of subfolders/items (and so on). For example, the first group, __Group One__ is described thusly: 

`{
	name: "Group One",					// the display name rendered in the browser
	id: "tabsample_groupOne",			// a HTML id assigned to the element
	handler: function(elId) { ... },	// a callback function to call when an item in the group is clicked
										// the function can either be an inline anonymous function, or
										// it can reference an existing function (e.g. handler: this._myClickHandler)
	folders: [							// an object containing folders/items belonging to the group
		{
			name: "Group One Item One",			// the display name rendered in the browser
			icon: null,							// a CSS class describing an icon (e.g. ImgMailApp). If null or missing, no icon will be displayed.
			id: "tabsample_groupOne_itemOne"	// a HTML id assigned to the element
		},
		{ ... },
		{ ... }
	]
}`

Folders with nested subfolders are automatically made collapsable (as in __Group Three__).

### Functions

Three functions are required to build the overview from the object literal:

* `this.buildOverview`: a public function that contains the object literal and iterates over the object, calling `this._buildFolderGroupHtml` and `this._renderFoldersHtml` for each group. In the real world, you would probably either build your folderGroup object from a remote datasource inside this function, or pass it in as an argument to `this.buildOverview`.
* `this._buildFolderGroupHtml`: a private function called by `this.buildOverview` that takes the current group as an argument. We create the HTML skeleton for the group (rendered from a template) and iterate over the folders contained in the group, calling `this._renderFoldersHtml` for each.
* `this._renderFoldersHtml`: a private function called by `this._buildFolderGroupHtml` and takes the current folder item as an argument. This is a recursive function; it will call itself for any subfolders, passing in a second "level" argument to indicate the amount of indentation each subfolder should have.

### Templates

The HTML needed to build the groups and folder items are all contained in templates (views), rendered by calling AjxTemplate.expand(). See the [template documentation](http://wiki.zimbra.com/wiki/ZCS_6.0:Zimlet_Developers_Guide:Templates) in the Zimlet Developers Guide for more information on templates.

### Click handling
`this.buildOverview` binds an `onclick` handler to each group. This came out of a requirement from the zimlet this sample was extracted from; each group needed a separate handler. You could easily modify this to assign one handler to the entire tree.

The "global" handler (`this._overviewClickHandler`) is responsible for determining if the user clicked on an expand/collapse handle or on an actual tree item. If they clicked on a handle, the appropriate item will be collapsed or expanded by setting CSS classes on the item. If they clicked on an item in the tree, and a handler was assigned to that item's group in the folderGroups object, that function will be called and the HTML ID of the clicked-upon item will be passed to the function as an argument (`elId`). 

## Requirements

* Zimbra Collaboration Suite 6.0 or better  _-- or --_
* Zimbra Desktop 2.0 or better

## Installation

### ZCS 6.0
Either deploy `com_grahamballantyne_taboverviewsample/dist/com_grahamballantyne_taboverviewsample.zip` using `zmzimletctl deploy`, or use the [_dev trick](http://wiki.zimbra.com/wiki/ZCS_6.0:Zimlet_Developers_Guide:Dev_Environment_Setup#Zimlet_Development_Directory) and copy `com_grahamballantyne_taboverviewsample/src/com_grahamballantyne_taboverviewsample` into `{zcs-install-dir}/zimlets-deployed/_dev`

### Zimbra Desktop 2.0
Either deploy `com_grahamballantyne_taboverviewsample/dist/com_grahamballantyne_taboverviewsample.zip` by copying the zip file into `{zd-user-dir}/zimlets`, or use the [_dev trick](http://wiki.zimbra.com/wiki/ZCS_6.0:Zimlet_Developers_Guide:Dev_Environment_Setup#Zimlet_Development_Directory) and copy `com_grahamballantyne_taboverviewsample/src/com_grahamballantyne_taboverviewsample` into `{zd-install-dir}/zimlets-deployed/_dev`

## Contributing

This sample is a work in progress. If you have any ideas you'd like to contribute, you can do so in the following ways:

* If you're a Github user (and if you're not, why aren't you?), [fork this project on Github](http://github.com/grahamb/tab_overview_sample_zimlet), make your changes and issue a pull request.
* Send me your patches to [zimlet@grahamballantyne.com](mailto:zimlet@grahamballantyne.com).
* Post in the [discussion]() on the Zimbra forums.

## License & Warranty

This code is provided under the __Graham Ballantyne - Do Whatever The Hell You Want With It__ license. No warranty is made about this code.