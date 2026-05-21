import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

// Data with Mandatory Property
export const MUI_X_PRODUCTS = [
  {
    id: '1', // Parent DSC
    label: 'DSC',
    children: [
      { id: '1-1', label: 'TimeStamp', mandatory: 'Yes' },
      { id: '1-2', label: 'CRL', mandatory: 'Yes' },
      { id: '1-3', label: 'OCSP', mandatory: 'Yes' },
      { id: '1-4', label: 'SSL/Code Signer', mandatory: 'No' },
    ],
  },
  {
    id: '2', // Parent eSign
    label: 'eSign',
    children: [
      { id: '2-1', label: 'TimeStamp', mandatory: 'Yes' },
      { id: '2-2', label: 'CRL', mandatory: 'Yes' },
      { id: '2-3', label: 'OCSP', mandatory: 'Yes' },
    ],
  },
];

const CustomCheckbox = React.forwardRef((props, ref) => {
  return <input type="checkbox" ref={ref} {...props} style={{ marginRight: '12px', width: '20px', height: '20px' }} />;
});

const CustomTreeItem = React.forwardRef((props, ref) => {
  return (
    <TreeItem2
      {...props}
      ref={ref}
      slots={{
        checkbox: CustomCheckbox,
      }}
      sx={{
        '& .MuiTreeItem2-label': {
          fontSize: '1.2rem', // Larger font size (default ~16px)
          padding: '8px 0', // Vertical margin between items
        },
      }}
    />
  );
});

const CheckboxTreeView = ({ data = MUI_X_PRODUCTS, preSelectedParentId = '1', onSelectionChange }) => {
  const getMandatoryChildrenIds = (parentId, items) => {
    const parent = items.find(item => item.id === parentId);
    if (!parent || !parent.children) return [];
    return parent.children
      .filter(child => child.mandatory === 'Yes')
      .map(child => child.id);
  };

  const initialSelected = [preSelectedParentId, ...getMandatoryChildrenIds(preSelectedParentId, data)];
  const [selectedItems, setSelectedItems] = useState(initialSelected);

  const getChildrenIds = (parentId, items) => {
    const parent = items.find(item => item.id === parentId);
    if (!parent || !parent.children) return [];
    return parent.children.map(child => child.id);
  };

  const handleSelectedItemsChange = (event, newSelectedItems) => {
    let updatedSelectedItems = [...newSelectedItems];

    if (updatedSelectedItems.includes('1')) {
      const dscChildren = getChildrenIds('1', data);
      const mandatoryChildren = getMandatoryChildrenIds('1', data);
      updatedSelectedItems = [...new Set([...updatedSelectedItems, ...mandatoryChildren])];
      const optionalSelected = updatedSelectedItems.filter(id => dscChildren.includes(id) && !mandatoryChildren.includes(id));
      updatedSelectedItems = [...new Set([...updatedSelectedItems, ...optionalSelected])];
    } else {
      const dscChildren = getChildrenIds('1', data);
      updatedSelectedItems = updatedSelectedItems.filter(item => !dscChildren.includes(item));
    }

    if (updatedSelectedItems.includes('2')) {
      const eSignChildren = getChildrenIds('2', data);
      updatedSelectedItems = [...new Set([...updatedSelectedItems, ...eSignChildren])];
    } else {
      const eSignChildren = getChildrenIds('2', data);
      updatedSelectedItems = updatedSelectedItems.filter(item => !eSignChildren.includes(item));
    }

    setSelectedItems(updatedSelectedItems);
    if (onSelectionChange) onSelectionChange(updatedSelectedItems);
  };

  useEffect(() => {
    if (selectedItems.includes(preSelectedParentId)) {
      const mandatoryChildren = getMandatoryChildrenIds(preSelectedParentId, data);
      setSelectedItems(prev => [...new Set([...prev, ...mandatoryChildren])]);
    }
  }, [preSelectedParentId, data]);

  const firstTreeData = data.filter(item => item.id === '1');
  const secondTreeData = data.filter(item => item.id === '2');

  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <RichTreeView
            defaultExpandedItems={['1']}
            checkboxSelection
            items={firstTreeData}
            slots={{ item: CustomTreeItem }}
            defaultSelectedItems={initialSelected}
            selectedItems={selectedItems}
            onSelectedItemsChange={handleSelectedItemsChange}
            multiSelect
            sx={{
              '& .MuiTreeItem2-content': {
                margin: '8px 0', // Margin between tree items
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <RichTreeView
            defaultExpandedItems={['2']}
            checkboxSelection
            items={secondTreeData}
            slots={{ item: CustomTreeItem }}
            selectedItems={selectedItems}
            onSelectedItemsChange={handleSelectedItemsChange}
            multiSelect
            sx={{
              '& .MuiTreeItem2-content': {
                margin: '8px 0', // Margin between tree items
              },
            }}
          />
        </Grid>
      </Grid>
      {/* <Box sx={{ mt: 2 }}>
        <pre style={{ fontSize: '1.2rem' }}>Selected: {JSON.stringify(selectedItems, null, 2)}</pre>
      </Box> */}
    </Box>
  );
};

export default CheckboxTreeView;