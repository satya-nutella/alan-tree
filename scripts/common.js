"use strict";

export const NODE_MAX_KEY = 99;
export const EDGE_B = 10;
export const NODE_W = 20;
export const NODE_H = 40;
export const BASE_X = 55;
export const BASE_Y = 30;
export const FIRST_X = 10;
export const FIRST_Y = 10;
export const C_SIZE = 20;

export const randInt = (x) => {
  return Math.floor(Math.random() * x);
};

export const setAddRandom = (addTreeNode) => {
  const input = document.querySelector(`.node-key`);
  document.querySelector(`.add-random`).onclick = (el) => {
    const v = randInt(NODE_MAX_KEY + 1);
    addTreeNode(v);
    input.value = v;
  };
};

export const removeNode = (id) => {
  const es = document.getElementsByClassName(`node${id}`);
  for (let e of es) {
    e.remove();
  }
};

export const removeEdge = (id) => {
  const es = document.getElementsByClassName(`edge${id}`);
  for (let e of es) {
    e.remove();
  }
};

export const beginChangeColor = (targetNode, updateNodes) => {
  if (targetNode !== null) {
    const clist = targetNode.querySelector(`circle`).classList;
    clist.remove(`normal-node`);
    clist.add(`target-node`);
  }
  for (let node of updateNodes) {
    if (targetNode === node) continue;

    const clist = node.querySelector(`circle`).classList;
    clist.remove(`normal-node`);
    clist.add(`update-node`);
  }
};

export const endChangeColor = (targetNode, updateNodes) => {
  if (targetNode !== null) {
    const clist = targetNode.querySelector(`circle`).classList;
    clist.remove(`target-node`);
    clist.add(`normal-node`);
  }
  for (let node of updateNodes) {
    if (targetNode === node) continue;

    const clist = node.querySelector(`circle`).classList;
    clist.remove(`update-node`);
    clist.add(`normal-node`);
  }
};

export const setRemoveValue = (removeTreeNode) => {
  document.querySelector(`.remove`).onclick = (el) => {
    const v = parseInt(val, 10);
    if (!isNaN(v) && 0 <= v && v <= NODE_MAX_KEY) {
      removeTreeNode(v);
    }
  };
};

export const defaultChangeCanvasSize = (canvas, width, height) => {
  const style = canvas.style;
  style.width = `${width}px`;
  style.height = `${height}px`;
};

export const getNodePx = (p) => {
  return p[0] * NODE_W + BASE_X;
};

export const getNodePy = (p) => {
  return p[1] * NODE_H + BASE_Y;
};

export const getEdgePos = (p) => {
  const [rx, ry] = p;
  return [rx * NODE_W + EDGE_B + BASE_X, ry * NODE_H + EDGE_B + BASE_Y];
};

export const defaultTranslateObj = (nodeMap, ps, timeline) => {
  timeline
    .add({
      targets: [`g.node`],
      translateX: (el) => {
        const nodeId = el.getAttribute(`nid`);
        return getNodePx(ps[nodeId]);
      },
      translateY: (el) => {
        const nodeId = el.getAttribute(`nid`);
        return getNodePy(ps[nodeId]);
      },
      duration: 1000,
      easing: `linear`,
    })
    .add(
      {
        targets: [`path.edge`],
        d: [
          {
            value: (el) => {
              const nodeId = el.getAttribute(`nid`);
              const node = nodeMap[nodeId];
              const [fx, fy] = getEdgePos(ps[nodeId]);

              const leftChild = node.left,
                rightChild = node.right;
              let leftX = fx,
                leftY = fy;

              if (leftChild) {
                [leftX, leftY] = getEdgePos(ps[leftChild.id]);
              }

              let rightX = fx,
                rightY = fy;
              if (rightChild) {
                [rightX, rightY] = getEdgePos(ps[rightChild.id]);
              }

              return `M${leftX},${leftY}L${fx},${fy}L${rightX},${rightY}`;
            },
          },
        ],
        duration: 1000,
        easing: `linear`,
      },
      `-=1000`
    );
};

export const traverse = (root) => {
  let cursor = 0,
    maxDepth = 0;
  const result = {};

  const DFS = (node, depth) => {
    if (node.left) {
      DFS(node.left, depth + 1);
    }

    result[node.id] = [cursor++, depth];
    maxDepth = Math.max(maxDepth, depth);

    if (node.right) {
      DFS(node.right, depth + 1);
    }
  };

  if (root) {
    DFS(root, 0);
  }

  return {
    ps: result,
    depth: maxDepth,
  };
};

export const createNode = (val, id) => {
  const newG = document.createElementNS(`http://www.w3.org/2000/svg`, `g`);
  newG.setAttribute(`class`, `node${id} node`);
  newG.setAttribute(`style`, `transform: translateX(15px) translateY(15px)`);
  newG.setAttribute(`value`, val);
  newG.setAttribute(`nid`, id);
  newG.setAttribute(`opacity`, 1.0);

  // add an onclick event listener
  newG.onclick = (el) => {
    const input = document.querySelector(`.node-key`);
    if (input) input.value = val;
  };

  const newCircle = document.createElementNS(
    `http://www.w3.org/2000/svg`,
    `circle`
  );
  newCircle.setAttribute(`class`, `normal-node node-circle`);
  newCircle.setAttribute(`cx`, FIRST_X);
  newCircle.setAttribute(`cy`, FIRST_Y);
  newCircle.setAttribute(`r`, C_SIZE);

  const newText = document.createElementNS(
    `http://www.w3.org/2000/svg`,
    `text`
  );
  newText.setAttribute(`class`, `node-text`);
  newText.setAttribute(`x`, -5);
  newText.setAttribute(`y`, 17);
  newText.innerHTML = val;

  newG.appendChild(newCircle);
  newG.appendChild(newText);
  return newG;
};

export const createEdge = (val, id) => {
  const x = FIRST_X + EDGE_B,
    y = FIRST_Y + EDGE_B;
  const newEl = document.createElementNS(`http://www.w3.org/2000/svg`, `path`);
  newEl.setAttribute(`class`, `edge${id} edge`);
  newEl.setAttribute(`d`, `M${x},${y}L${x},${y}L${x},${y}`);
  newEl.setAttribute(`value`, val);
  newEl.setAttribute(`nid`, id);
  newEl.setAttribute(`opacity`, 1.0);
  return newEl;
};
