const _ = require('underscore');

const IndexManager = {
  INDEXES: [ {
    name: 'material',
    index: 'makt',
    fields: [
      { name: 'mara_matnr', label: 'Material Number', search: true },
      { name: 'mara_mtart', label: 'Material Type', search: true },
      { name: 'makt_props.makt_maktg', label: 'Material description in upper case for matchcodes' },
      { name: 'makt_props.makt_maktx', label: 'Material mara_ernam (Short Text)', search: true },
      { name: 'mara_matkl', label: 'Material Group' },
      { name: 'mara_bismt', label: 'Old material number' },
      { name: 'mara_vhart', label: 'Packaging Material Type' },
      { name: 'mara_satnr', label: 'Cross-Plant Configurable Material' },
      { name: 'mara_pmata', label: 'Pricing Reference Material' },
      { name: 'mara_mfrpn', label: 'Manufacturer Part Number' },
      { name: 'mara_mfrnr', label: 'Number of a Manufacturer' },
      { name: 'mara_bmatn', label: 'Number of firm\'s own (internal) inventory-managed material' },
      { name: 'mara_ersda', label: 'Created At' },
      { name: 'mara_ernam', label: 'Created By', search: true },
      { name: 'mara_laeda', label: 'Modified At' },
      { name: 'mara_aenam', label: 'Modified By' },
      { name: 'mara_vpsta', label: 'Maintenance status of complete material' },
      { name: 'mara_pstat', label: 'Maintenance status' },
      { name: 'mara_lvorm', label: 'Flag Material for Deletion at Client Level' },
      { name: 'mara_mbrsh', label: 'Industry Sector' },
      { name: 'mara_meins', label: 'Base Unit of Measure' },
      { name: 'mara_bstme', label: 'Purchase Order Unit of Measure' },
      { name: 'mara_zeinr', label: 'Document number (without document management system)' },
      { name: 'mara_zeiar', label: 'Document type (without Document Management system)' },
      { name: 'mara_zeivr', label: 'Document version (without Document Management system)' },
      { name: 'mara_zeifo', label: 'Page format of document (without Document Management system)' },
      { name: 'mara_aeszn', label: 'Document change number (without document management system)' },
      { name: 'mara_blatt', label: 'Page number of document (without Document Management system)' },
      { name: 'mara_blanz', label: 'Number of sheets (without Document Management system)' },
      { name: 'mara_ferth', label: 'Production/inspection memo' },
      { name: 'mara_formt', label: 'Page Format of Production Memo' },
      { name: 'mara_groes', label: 'Size/dimensions' },
      { name: 'mara_wrkst', label: 'Basic Material' },
      { name: 'mara_normt', label: 'Industry Standard Description (such as ANSI or ISO)' },
      { name: 'mara_labor', label: 'Laboratory/design office' },
      { name: 'mara_ekwsl', label: 'Purchasing Value Key' },
      { name: 'mara_brgew', label: 'Gross Weight' },
      { name: 'mara_ntgew', label: 'Net Weight' },
      { name: 'mara_gewei', label: 'Weight Unit' },
      { name: 'mara_volum', label: 'Volume' },
      { name: 'mara_voleh', label: 'Volume unit' },
      { name: 'mara_behvo', label: 'Container requirements' },
      { name: 'mara_raube', label: 'Storage conditions' },
      { name: 'mara_tempb', label: 'Temperature conditions indicator' },
      { name: 'mara_disst', label: 'Low-Level Code' },
      { name: 'mara_tragr', label: 'Transportation Group' },
      { name: 'mara_stoff', label: 'Hazardous material number' },
      { name: 'mara_spart', label: 'Division' },
      { name: 'mara_kunnr', label: 'Competitor' },
      { name: 'mara_eannr', label: 'European Article Number (EAN) - obsolete!!!!!' },
      { name: 'mara_wesch', label: 'Quantity: Number of GR/GI slips to be printed' },
      { name: 'mara_bwvor', label: 'Procurement rule' },
      { name: 'mara_bwscl', label: 'Source of Supply' },
      { name: 'mara_saiso', label: 'Season Category' },
      { name: 'mara_etiar', label: 'Label type' },
      { name: 'mara_etifo', label: 'Label form' },
      { name: 'mara_entar', label: 'Deactivated' },
      { name: 'mara.ean11', label: 'International Article Number (EAN/UPC)' },
      { name: 'mara.numtp', label: 'Category of International Article Number (EAN)' },
      { name: 'mara.laeng', label: 'Length' },
      { name: 'mara.breit', label: 'Width' },
      { name: 'mara.hoehe', label: 'Height' },
      { name: 'mara.meabm', label: 'Unit of Dimension for Length/Width/Height' },
      { name: 'mara.prdha', label: 'Product hierarchy' },
      { name: 'mara.aeklk', label: 'Stock Transfer Net Change Costing' },
      { name: 'mara.cadkz', label: 'CAD Indicator' },
      { name: 'mara.qmpur', label: 'QM in Procurement is Active' },
      { name: 'mara.ergew', label: 'Allowed packaging weight' },
      { name: 'mara.ergei', label: 'Unit of weight (allowed packaging weight)' },
      { name: 'mara.ervol', label: 'Allowed packaging volume' },
      { name: 'mara.ervoe', label: 'Volume unit (allowed packaging volume)' },
      { name: 'mara.gewto', label: 'Excess Weight Tolerance for Handling unit' },
      { name: 'mara.volto', label: 'Excess Volume Tolerance of the Handling Unit' },
      { name: 'mara.vabme', label: 'Variable Purchase Order Unit Active' },
      { name: 'mara.kzrev', label: 'Revision Level Has Been Assigned to the Material' },
      { name: 'mara.kzkfg', label: 'Configurable Material' },
      { name: 'mara.xchpf', label: 'Batch management requirement indicator' },
      { name: 'mara.fuelg', label: 'Maximum level (by volume)' },
      { name: 'mara.stfak', label: 'Stacking factor' },
      { name: 'mara.magrv', label: 'Material Group: Packaging Materials' },
      { name: 'mara.begru', label: 'Authorization Group' },
      { name: 'mara.datab', label: 'Valid-From Date' },
      { name: 'mara.liqdt', label: 'Deletion date' },
      { name: 'mara.saisj', label: 'Season Year' },
      { name: 'mara.plgtp', label: 'Price Band Category' },
      { name: 'mara.mlgut', label: 'Empties Bill of Material' },
      { name: 'mara.extwg', label: 'External Material Group' },
      { name: 'mara.attyp', label: 'Material Category' },
      { name: 'mara.kzkup', label: 'Indicator: Material can be co-product' },
      { name: 'mara.kznfm', label: 'Indicator: The material has a follow-up material' },
      { name: 'mara.mstae', label: 'Cross-Plant Material Status' },
      { name: 'mara.mstav', label: 'Cross-distribution-chain material status' },
      { name: 'mara.mstde', label: 'Date from which the cross-plant material status is valid' },
      { name: 'mara.mstdv', label: 'Date from which the X-distr.-chain material status is valid' },
      { name: 'mara.taklv', label: 'Tax classification of the material' },
      { name: 'mara.rbnrm', label: 'Catalog Profile' },
      { name: 'mara.mhdrz', label: 'Minimum Remaining Shelf Life' },
      { name: 'mara.mhdhb', label: 'Total shelf life' },
      { name: 'mara.mhdlp', label: 'Storage percentage' },
      { name: 'mara.inhme', label: 'Content unit' },
      { name: 'mara.inhal', label: 'Net contents' },
      { name: 'mara.vpreh', label: 'Comparison price unit' },
      { name: 'mara.etiag', label: 'IS-R Labeling: material grouping (deactivated in 4.0)' },
      { name: 'mara.inhbr', label: 'Gross contents' },
      { name: 'mara.cmeth', label: 'Quantity Conversion Method' },
      { name: 'mara.cuobf', label: 'Internal object number' },
      { name: 'mara.kzumw', label: 'Environmentally Relevant' },
      { name: 'mara.kosch', label: 'Product allocation determination procedure' },
      { name: 'mara.sprof', label: 'Pricing profile for variants' },
      { name: 'mara.nrfhg', label: 'Material qualifies for discount in kind' },
      { name: 'mara.mprof', label: 'Manufacturer Part Profile' },
      { name: 'mara.kzwsm', label: 'Units of measure usage' },
      { name: 'mara.saity', label: 'Rollout in a Season' },
      { name: 'mara.profl', label: 'Dangerous Goods Indicator Profile' },
      { name: 'mara.ihivi', label: 'Indicator: Highly Viscous' },
      { name: 'mara.iloos', label: 'Indicator: In Bulk/Liquid' },
      { name: 'mara.serlv', label: 'Level of Explicitness for Serial Number' },
      { name: 'mara.kzgvh', label: 'Packaging Material is Closed Packaging' },
      { name: 'mara.xgchp', label: 'Indicator: Approved batch record required' },
      { name: 'mara.kzeff', label: 'Assign effectivity parameter values/ override change numbers' },
      { name: 'mara.compl', label: 'Material completion level' },
      { name: 'mara.iprkz', label: 'Period Indicator for Shelf Life Expiration Date' },
      { name: 'mara.rdmhd', label: 'Rounding rule for calculation of SLED' },
      { name: 'mara.przus', label: 'Indicator: Product composition printed on packaging' },
      { name: 'mara.mtpos_mara', label: 'General item category group' },
      { name: 'mara.bflme', label: 'Generic Material with Logistical Variants' },
      { name: 'mara.matfi', label: 'Material Is Locked' },
      { name: 'mara.cmrel', label: 'Relevant for Configuration Management' },
      { name: 'mara.bbtyp', label: 'Assortment List Type' },
      { name: 'mara.sled_bbd', label: 'Expiration Date' },
      { name: 'mara.gtin_variant', label: 'Global Trade Item Number Variant' },
      { name: 'mara.gennr', label: 'Material Number of the Generic Material in Prepack Materials' },
      { name: 'mara.rmatp', label: 'Reference material for materials packed in same way' },
      { name: 'mara.gds_relevant', label: 'Indicator: Global Data Synchronization-Relevant' },
      { name: 'mara.weora', label: 'Acceptance At Origin' },
      { name: 'mara.hutyp_dflt', label: 'Standard HU Type' },
      { name: 'mara.pilferable', label: 'Pilferable' },
      { name: 'mara.whstc', label: 'Warehouse Storage Condition' },
      { name: 'mara.whmatgr', label: 'Warehouse Material Group' },
      { name: 'mara.hndlcode', label: 'Handling Indicator' },
      { name: 'mara.hazmat', label: 'Relevant for Hazardous Substances' },
      { name: 'mara.hutyp', label: 'Handling Unit Type' },
      { name: 'mara.tare_var', label: 'Variable Tare Weight' },
      { name: 'mara.maxc', label: 'Maximum Allowed Capacity of Packaging Material' },
      { name: 'mara.maxc_tol', label: 'Overcapacity Tolerance of the Handling Unit' },
      { name: 'mara.maxl', label: 'Maximum Packing Length of Packaging Material' },
      { name: 'mara.maxb', label: 'Maximum Packing Width of Packaging Material' },
      { name: 'mara.maxh', label: 'Maximum Packing Height of Packaging Material' },
      { name: 'mara.maxdim_uom', label: 'Unit of Measure for Maximum Packing Length/Width/Height' },
      { name: 'mara.herkl', label: 'Country of origin of the material' },
      { name: 'mara.mfrgr', label: 'Material freight group' },
      { name: 'mara.qqtime', label: 'Quarantine Period' },
      { name: 'mara.qqtimeuom', label: 'Time Unit for Quarantine Period' },
      { name: 'mara.qgrp', label: 'Quality Inspection Group' },
      { name: 'mara.serial', label: 'Serial Number Profile' },
      { name: 'mara.ps_smartform', label: 'Form Name' },
      { name: 'mara.logunit', label: 'EWM CW: Logistics Unit of Measure' },
      { name: 'mara.cwqrel', label: 'EWM CW: Material Is Relevant to Catch Weight' },
      { name: 'mara.cwqproc', label: 'EWM CWM: Control of CW Quantity Entry' },
      { name: 'mara.cwqtolgr', label: 'EWM CW: Catch Weight Tolerance Group' },
      { name: 'mara./bev1/luleinh', label: 'Loading Units' },
      { name: 'mara./bev1/luldegrp', label: 'Loading Unit Group: IS Beverage' },
      { name: 'mara./bev1/nestruccat', label: 'Structure Category for Material Relationship' },
      { name: 'mara./dsd/vc_group', label: 'DSD Grouping' },
      { name: 'mara./vso/r_tilt_ind', label: 'Material may be Tilted (Vehicle Space Optimization)' },
      { name: 'mara./vso/r_stack_ind', label: 'Stacking not Allowed (VSO)' },
      { name: 'mara./vso/r_bot_ind', label: 'Bottom Layer (Vehicle Space Optimization)' },
      { name: 'mara./vso/r_top_ind', label: 'Top Layer (VSO)' },
      { name: 'mara./vso/r_stack_no', label: 'Stacking Factor (Vehicle Space Optimization)' },
      { name: 'mara./vso/r_pal_ind', label: 'Load without Packaging Material (VSO)' },
      { name: 'mara./vso/r_pal_ovr_d', label: 'Permissible Overhang (Depth) of Packaging Material (VSO)' },
      { name: 'mara./vso/r_pal_ovr_w', label: 'Permissible Overhang (Width) of Shipping Material (VSO)' },
      { name: 'mara./vso/r_pal_b_ht', label: 'Maximum Stacking Height of the Packaging Material (VSO)' },
      { name: 'mara./vso/r_pal_min_h', label: 'Minimum Stacking Height of the Packaging Material (VSO)' },
      { name: 'mara./vso/r_tol_b_ht', label: 'Tolerance to Exceed the Max. Stacking Height (VSO)' },
      { name: 'mara./vso/r_no_p_gvh', label: 'Number of Materials for each Closed PKM (VSO)' },
      { name: 'mara./vso/r_quan_unit', label: 'Unit of Measure Vehicle Space Optimization' },
      { name: 'mara./vso/r_kzgvh_ind', label: 'Closed Packaging Material Required (VSO)' },
      { name: 'mara.mcond', label: 'Material Condition Management' },
      { name: 'mara.retdelc', label: 'Return Code' },
      { name: 'mara.loglev_reto', label: 'Return to Logistics Level' },
      { name: 'mara.nsnid', label: 'NATO Stock Number' },
      { name: 'mara.imatn', label: 'FFF class' },
      { name: 'mara.picnum', label: 'Supersession chain number' },
      { name: 'mara.bstat', label: 'Creation Status - Seasonal Procurement' },
      { name: 'mara.color_atinn', label: 'Internal Charactieristic Number for Color Characteristics' },
      { name: 'mara.size1_atinn', label: 'Internal Char. Number for Characteristics for Main Sizes' },
      { name: 'mara.size2_atinn', label: 'Internal Char. Number for Characteristics for Second Sizes' },
      { name: 'mara.color', label: 'Characteristic Value for Colors of Variants' },
      { name: 'mara.size1', label: 'Characteristic Value for Main Sizes of Variants' },
      { name: 'mara.size2', label: 'Characteristic Value for Second Size for Variants' },
      { name: 'mara.free_char', label: 'Characteristic Value for Evaluation Purposes' },
      { name: 'mara.care_code', label: 'Care Codes (such as Washing Code, Ironing Code, etc.)' },
      { name: 'mara.brand_id', label: 'Brand' },
      { name: 'mara.fiber_code1', label: 'Fiber Code for Textiles (Component 1)' },
      { name: 'mara.fiber_part1', label: 'Percentage Share of Fiber (Component 1)' },
      { name: 'mara.fiber_code2', label: 'Fiber Code for Textiles (Component 2)' },
      { name: 'mara.fiber_part2', label: 'Percentage Share of Fiber (Component 2)' },
      { name: 'mara.fiber_code3', label: 'Fiber Code for Textiles (Component 3)' },
      { name: 'mara.fiber_part3', label: 'Percentage Share of Fiber (Component 3)' },
      { name: 'mara.fiber_code4', label: 'Fiber Code for Textiles (Component 4)' },
      { name: 'mara.fiber_part4', label: 'Percentage Share of Fiber (Component 4)' },
      { name: 'mara.fiber_code5', label: 'Fiber Code for Textiles (Component 5)' },
      { name: 'mara.fiber_part5', label: 'Percentage Share of Fiber (Component 5)' },
      { name: 'mara.fashgrd', label: 'Fashion Grade' },
      { name: 'makt.spras', label: 'Language Key' },
    ],
  }, {
    name: 'customer',
    index: 'customer',
    fields: [
      { name: 'kna1_kunnr', label: 'Name', search: true },
      { name: 'kna1_land1', label: 'Country key', search: true },
      { name: 'kna1_name1', label: 'Name 1', search: true },
      { name: 'kna1_name2', label: 'Name 2', search: true },
      { name: 'kna1_ort01', label: 'City', search: true },
      { name: 'kna1_pstlz', label: 'Postal Code' },
      { name: 'kna1_stras', label: 'House Number And Street' },
      { name: 'knb1_props.knb1_bukrs', label: 'Company Code', search: true },
      { name: 'knb1_props.knb1_zterm', label: 'Terms of Payment Key', search: true },
      { name: 'knvk_props.knvk_namev', label: 'Company First Name', search: true },
      { name: 'knvk_props.knvk_name1', label: 'Company Last Name', search: true },
    ],
  } ],

  getIndexConfig: (index) => {
    return _.find(IndexManager.INDEXES, indexConfig => indexConfig.name === index);
  },
};

module.exports = IndexManager;
