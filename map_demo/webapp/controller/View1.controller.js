sap.ui.controller("map_demo.controller.View1", {
	onInit: function() {
 
 
		this.aKeys= ["CompanyCode", "CompanyName"];
 

 
		this.aItems= [{CompanyCode: "0001", CompanyName: "SAP A.G.", City: "Walldorf", CurrencyCode:"EUR"},
	                 {CompanyCode: "0002", CompanyName: "SAP Laps India", City: "Bangalore", CurrencyCode:"INR"}
	                
	                 ];
				
	},
	
	
		onValueHelpRequest: function() {
		var that= this;
		
		var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
			basicSearchText: this.theTokenInput.getValue(), 
			title: "Company",
			supportMultiselect: false,
			supportRanges: false,
			supportRangesOnly: false, 
			key: this.aKeys[0],				
			descriptionKey: this.aKeys[1],
			stretch: sap.ui.Device.system.phone, 
 
			ok: function(oControlEvent) {
				that.aTokens = oControlEvent.getParameter("tokens");
				that.theTokenInput.setTokens(that.aTokens);
 
				oValueHelpDialog.close();
			},
 
			cancel: function(oControlEvent) {
				sap.m.MessageToast.show("Cancel pressed!");
				oValueHelpDialog.close();
			},
 
			afterClose: function() {
				oValueHelpDialog.destroy();
			}
		});
		
		
		var oColModel = new sap.ui.model.json.JSONModel();
		oColModel.setData({
			cols: [
			      	{label: "Company Code", template: "CompanyCode"},
			        {label: "Company Name", template: "CompanyName"},
			        {label: "City", template: "City", demandPopin : true},
			        {label: "Currency Code", template: "CurrencyCode", demandPopin : true}
			      ]
		});
		oValueHelpDialog.getTable().setModel(oColModel, "columns");
 
		
		var oRowsModel = new sap.ui.model.json.JSONModel();
		oRowsModel.setData(this.aItems);
		oValueHelpDialog.getTable().setModel(oRowsModel);
		if (oValueHelpDialog.getTable().bindRows) {
			oValueHelpDialog.getTable().bindRows("/"); 
		}
		if (oValueHelpDialog.getTable().bindItems) { 
			var oTable = oValueHelpDialog.getTable();
			
			oTable.bindAggregation("items", "/", function(sId, oContext) { 
				var aCols = oTable.getModel("columns").getData().cols;
			
				return new sap.m.ColumnListItem({
					cells: aCols.map(function (column) {
						var colname = column.template;
						return new sap.m.Label({ text: "{" + colname + "}" });
					})
				});
			});
		}	
		
		oValueHelpDialog.setTokens(this.theTokenInput.getTokens());
		
		var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
			advancedMode:  true,
			filterBarExpanded: false,
			showGoOnFB: !sap.ui.Device.system.phone,
			filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Company Code", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "Company Name", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n3", label: "City", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n4", label: "Currency Code", control: new sap.m.Input()})],
			search: function() {
				sap.m.MessageToast.show("Search pressed '"+arguments[0].mParameters.selectionSet[0].getValue()+"''");
			}
		});			
				
		if (oFilterBar.setBasicSearch) {
			oFilterBar.setBasicSearch(new sap.m.SearchField({
				showSearchButton: sap.ui.Device.system.phone, 
				placeholder: "Search",
				search: function(event) {
					oValueHelpDialog.getFilterBar().search();
				} 
			}));  
		}
		
		oValueHelpDialog.setFilterBar(oFilterBar);
		
		if (this.theTokenInput.$().closest(".sapUiSizeCompact").length > 0) { // check if the Token field runs in Compact mode
			oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		} else {
			oValueHelpDialog.addStyleClass("sapUiSizeCozy");			
		}
		
		oValueHelpDialog.open();
		oValueHelpDialog.update();
	}
 
});
