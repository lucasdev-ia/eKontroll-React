import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';

interface OrgChartNode {
  id: string;
  name: string;
  title: string;
  children?: OrgChartNode[];
}

interface OrgChartProps {
  data: OrgChartNode;
}

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid #ccc;
`;

const StyledTitle = styled.div`
  font-weight: bold;
`;

const StyledName = styled.div`
  font-size: 0.9em;
  color: #666;
`;

const renderTreeNodes = (node: OrgChartNode) => (
  <TreeNode
    key={node.id}
    label={
      <StyledNode>
        <StyledTitle>{node.title}</StyledTitle>
        <StyledName>{node.name}</StyledName>
      </StyledNode>
    }
  >
    {node.children?.map((child) => renderTreeNodes(child))}
  </TreeNode>
);

const OrgChartComponent: React.FC<OrgChartProps> = ({ data }) => {
  return (
    <Tree
      lineWidth={'2px'}
      lineColor={'#ccc'}
      lineBorderRadius={'10px'}
      label={
        <StyledNode>
          <StyledTitle>{data.title}</StyledTitle>
          <StyledName>{data.name}</StyledName>
        </StyledNode>
      }
    >
      {data.children?.map((child) => renderTreeNodes(child))}
    </Tree>
  );
};

export default OrgChartComponent;