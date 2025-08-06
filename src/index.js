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

  insert(value) {
    function insertRecursive(root, value) {
      // Base Case: If the child is null, insert the new value (node)
      if (root === null) {
        return new Node(value);
      }

      // If the child is a duplicate, return the child to maintain structure
      if (root.data === value) {
        return root;
      }

      // If value is less, go to the left
      if (value < root.data) {
        root.left = insertRecursive(root.left, value);
      }
      // If value is greater, go to the right
      else if (value > root.data) {
        root.right = insertRecursive(root.right, value);
      }

      return root;
    }

    this.root = insertRecursive(this.root, value);
  }

  delete(value) {
    function deleteRecursive(root, value) {
      // Base Case: Value not found, empty tree, gone past leaf
      if (root === null) {
        return null;
      }

      if (value < root.data) {
        // If value is smaller, go to the left
        root.left = deleteRecursive(root.left, value);
      } else if (value > root.data) {
        // If value is bigger, go to the right
        root.right = deleteRecursive(root.right, value);
      } else {
        // Value found. Case 1: Node has no children
        if (root.right === null && root.left === null) {
          return null;
          // Case 2A: Node has one child (left)
        } else if (root.right === null && root.left !== null) {
          return root.left;
          // Case 2B: Node has one child (right)
        } else if (root.right !== null && root.left === null) {
          return root.right;
          // Case 3: Node has two children
        } else {
          let successor = getSuccessor(root);
          // Replace the node to delete's data with successor's data
          root.data = successor.data;
          // Recursively delete the successor
          root.right = deleteRecursive(root.right, successor.data);
        }
      }

      return root;
    }

    function getSuccessor(root) {
      // The successor has to be in the right subtree of the deleted root
      let current = root.right;

      // Keep going left as far as possible
      while (current !== null && current.left !== null) {
        current = current.left;
      }

      return current;
    }

    this.root = deleteRecursive(this.root, value);
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
testTree.insert(69);
testTree.insert(420);
testTree.insert(1738);
console.log(prettyPrint(testTree.root));
