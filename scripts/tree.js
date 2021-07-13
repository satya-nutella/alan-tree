"use strict";

export default class BaseNode {
  constructor(val) {
    this.left = this.right = null;
    this.prt = null;
    this.val = val;
    this.id = ++BaseNode.nodeIdGen;
  }

  removeLeft() {
    const left = this.left;

    if (left) {
      this.left = left.prt = null;
    }

    return left;
  }

  removeRight() {
    const right = this.right;

    if (right) {
      this.right = right.prt = null;
    }

    return right;
  }

  setLeft(node) {
    if (this.left) {
      this.removeLeft();
    }

    this.left = node;

    if (node) {
      if (node.prt) {
        node.prt.removeChild(node);
      }
      node.prt = this;
    }
  }

  setRight(node) {
    if (this.right) {
      this.removeRight();
    }

    this.right = node;

    if (node) {
      if (node.prt) {
        node.prt.removeChild(node);
      }
      node.prt = this;
    }
  }

  removeChild(node) {
    if (this.left === node) {
      this.removeLeft();
    }

    if (this.right === node) {
      this.removeRight();
    }
  }

  isLeft(node) {
    return this.left === node;
  }

  isRight(node) {
    return this.right === node;
  }
}
