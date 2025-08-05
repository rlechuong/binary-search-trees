import "./styles.css";

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = buildTree(array);
  }
}

function buildTree(array) {
  const sortedArray = array.sort((a, b) => a - b);
  const uniqueArray = [...new Set(sortedArray)];

  function buildTreeRecursive(array, start, end) {
    if (start > end) {
      return null;
    }

    const mid = Math.floor((start + end) / 2);

    const root = new Node(array[mid]);
    root.left = buildTreeRecursive(array, start, mid - 1);
    root.right = buildTreeRecursive(array, mid + 1, end);

    return root;
  }

  return buildTreeRecursive(uniqueArray, 0, uniqueArray.length - 1);
}

// For visualizing binary search tree
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const testTree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
console.log(prettyPrint(testTree.root));
