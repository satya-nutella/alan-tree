import anime from "animejs/lib/anime.es";
import BinarySearchTree from "./scripts/BinarySearchTree";
import {
  NODE_W,
  NODE_H,
  BASE_X,
  BASE_Y,
  beginChangeColor,
  createNode,
  createEdge,
  defaultChangeCanvasSize,
  defaultTranslateObj,
  endChangeColor,
  removeEdge,
  removeNode,
  setAddRandom,
  traverse
} from "./scripts/common";

window.onload = () => {
  const tree = new BinarySearchTree();

  const nodeView = {},
    nodeMap = {};

  let timeline = null, deleteNodeId = null;

  const canvas = document.querySelector(`svg.canvas`);
  const nodes = document.querySelector(`.nodes`);
  const edges = document.querySelector(`.edges`);
  const slider = document.querySelector(`.anime-slider`);

  slider.oninput = (el) => {
    if (timeline) {
      timeline.seek(timeline.duration * (slider.value / 100));
    }
  };

  const addNode = (v, node) => {
    const nodeId = node.id;
    nodes.appendChild(createNode(v, nodeId));
    edges.appendChild(createEdge(v, nodeId));
    const dNode = document.querySelector(`g.node${nodeId}`);
    const dEdge = document.querySelector(`path.edge${nodeId}`);

    nodeView[v] = {
      node: dNode,
      edge: dEdge,
    };

    nodeMap[nodeId] = node;
  };

  const changeCanvasSize = (width, height) => {
    defaultChangeCanvasSize(canvas, width, height);
  };

  const translateObj = (result) => {
    defaultTranslateObj(nodeMap, result, timeline);
  };

  const initTimeline = () => {
    if (deleteNodeId) {
      const nodeId = deleteNodeId;
      removeNode(nodeId);
      removeEdge(nodeId);
      deleteNodeId = null;
    }

    if (timeline) {
      timeline.seek(timeline.duration);
    }

    timeline = anime.timeline({
      duration: 1000,
      update: (anim) => {
        slider.value = timeline.progress;
      },
    });
  };

  const addTreeNode = (v) => {
    initTimeline();

    timeline.add({
      duration: 500,
    });

    let maxDepth = traverse(tree.root).depth;

    if (!tree.find(v)) {
      const node = tree.insert(v);

      addNode(v, node);

      const resultM = traverse(tree.root);
      translateObj(resultM.ps);
      maxDepth = Math.max(maxDepth, resultM.depth);
    }

    const targetNode = nodeView[v].node;

    const updateNodes = tree
      .getUpdateNodes()
      .map((node) => nodeView[node.val].node);

    timeline.changeBegin = () => {
      beginChangeColor(targetNode, updateNodes);
    };
    timeline.changeComplete = () => {
      endChangeColor(targetNode, updateNodes);
    };
    const nodeNum = Object.keys(nodeView).length;
    changeCanvasSize(
      nodeNum * NODE_W + BASE_X * 2,
      (maxDepth + 1) * NODE_H + BASE_Y * 2
    );
  };

  setAddRandom(addTreeNode);
};
