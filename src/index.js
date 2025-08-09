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

      // If neither null nor duplicate, return node to maintain structure
      return root;
    }

    this.root = insertRecursive(this.root, value);
  }

  deleteItem(value) {
    function deleteRecursive(root, value) {
      // Base Case: Value not found or empty tree
      if (root === null) {
        return null;
      }

      if (value < root.data) {
        // If value is smaller, search left subtree
        root.left = deleteRecursive(root.left, value);
      } else if (value > root.data) {
        // If value is bigger, search right subtree
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
      // The successor has to be in the right subtree of the root to delete
      let current = root.right;

      // Keep searching left subtree until hitting null
      while (current !== null && current.left !== null) {
        current = current.left;
      }

      return current;
    }

    this.root = deleteRecursive(this.root, value);
  }

  find(value) {
    function findRecursive(root, value) {
      // Value not found or empty tree, return null to bubble up
      if (root === null) {
        return null;
      }

      // Value found, return the Node to bubble up
      if (root.data === value) {
        return root;
      }

      // If value is smaller, search left subtree
      if (value < root.data) {
        return findRecursive(root.left, value);
        // If value is bigger, search right subtree
      } else if (value > root.data) {
        return findRecursive(root.right, value);
      }
    }

    return findRecursive(this.root, value);
  }

  levelOrderForEach(callback) {
    if (!callback) {
      throw new Error("A callback is required.");
    }

    // Go Back Up If Hitting Null
    if (this.root === null) {
      return;
    }

    let queue = [];
    queue.push(this.root);

    // Callback -> Add Left -> Add Right -> Remove Current Node
    while (queue.length > 0) {
      let current = queue[0];
      callback(current);
      if (current.left !== null) {
        queue.push(current.left);
      }
      if (current.right !== null) {
        queue.push(current.right);
      }
      queue.shift();
    }
  }

  inOrderForEach(callback) {
    if (!callback) {
      throw new Error("A callback is required.");
    }

    // Go Back Up If Hitting Null
    function inOrderForEachRecursive(root, callback) {
      if (root === null) {
        return;
      }

      // Go Left -> Callback -> Go Right
      inOrderForEachRecursive(root.left, callback);
      callback(root);
      inOrderForEachRecursive(root.right, callback);
    }

    inOrderForEachRecursive(this.root, callback);
  }

  preOrderForEach(callback) {
    if (!callback) {
      throw new Error("A callback is required.");
    }

    // Go Back Up If Hitting Null
    function preOrderForEachRecursive(root, callback) {
      if (root === null) {
        return;
      }

      // Callback -> Go Left -> Go Right
      callback(root);
      preOrderForEachRecursive(root.left, callback);
      preOrderForEachRecursive(root.right, callback);
    }

    preOrderForEachRecursive(this.root, callback);
  }

  postOrderForEach(callback) {
    if (!callback) {
      throw new Error("A callback is required.");
    }

    // Go Back Up If Hitting Null
    function postOrderForEachRecursive(root, callback) {
      if (root === null) {
        return;
      }

      // Go Left -> Go Right -> Callback
      postOrderForEachRecursive(root.left, callback);
      postOrderForEachRecursive(root.right, callback);
      callback(root);
    }

    postOrderForEachRecursive(this.root, callback);
  }

  height(value) {
    const targetNode = this.find(value);
    if (targetNode === null) {
      return null;
    }

    // Return -1 Since Only Counting Edges, Not Nodes
    function findHeight(root) {
      if (root === null) {
        return -1;
      }

      let leftHeight = findHeight(root.left);
      let rightHeight = findHeight(root.right);

      // Once The Deepest Leaf Node Is Found (Which Should = 0)
      // This Should Increment By 1 (Edge) Up To Target Node
      return Math.max(leftHeight, rightHeight) + 1;
    }

    return findHeight(targetNode);
  }

  depth(value) {
    const targetNode = this.find(value);
    if (targetNode === null) {
      return null;
    }

    function findDepth(root, target, currentDepth) {
      // Base Case: Target Not Found In Tree
      if (root === null) {
        return null;
      }

      // Target Found: Bubble Value Up The Tree
      if (root.data === target.data) {
        return currentDepth;
      }

      // Increment currentDepth Every Time A Child Is Visited
      if (target.data < root.data) {
        return findDepth(root.left, target, currentDepth + 1);
      } else if (target.data > root.data) {
        return findDepth(root.right, target, currentDepth + 1);
      }
    }

    // Start currentDepth At 0, To Be Incremented Per Call
    return findDepth(this.root, targetNode, 0);
  }

  isBalanced() {
    function isBalancedRecursive(root) {
      // Base Case: Return -1 Since Only Counting Edges
      if (root === null) {
        return { height: -1, balanced: true };
      }

      // Get Information From Child Nodes
      let leftInfo = isBalancedRecursive(root.left);
      let rightInfo = isBalancedRecursive(root.right);

      // For Each Node, Calculate Height
      let currentHeight = Math.max(leftInfo.height, rightInfo.height) + 1;
      // Calculate Balanced, Checking All 3 Conditions
      let currentBalanced = true;
      if (
        Math.abs(leftInfo.height - rightInfo.height) > 1 ||
        !leftInfo.balanced ||
        !rightInfo.balanced
      ) {
        currentBalanced = false;
      }

      // Store Current Node's Information And Bubble It Back Up
      return { height: currentHeight, balanced: currentBalanced };
    }
    return isBalancedRecursive(this.root).balanced;
  }

  rebalance() {
    const data = [];

    // Traverse Tree And Store All Data In Array
    this.inOrderForEach(function (node) {
      data.push(node.data);
    });

    // Rebuild Tree And Replace Root
    this.root = buildTree(data);
  }
}

function buildTree(array) {
  // Sort Array And Remove Duplicates
  const sortedArray = array.sort((a, b) => a - b);
  const uniqueArray = [...new Set(sortedArray)];

  function buildTreeRecursive(array, start, end) {
    if (start > end) {
      return null;
    }

    // Find The Mid Point Of The Array
    const mid = Math.floor((start + end) / 2);

    // Create A Node Using That Mid Point Value
    const root = new Node(array[mid]);
    // Cut The Array In Half Up To The Mid Point And Repeat
    root.left = buildTreeRecursive(array, start, mid - 1);
    // Cut The Array In Half Past The Mid Point And Repeat
    root.right = buildTreeRecursive(array, mid + 1, end);

    // Return The Root With Right And Left Assigned To Bubble Up
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

// Driver Script

// Random Integer From 10-15
const randomCount = Math.floor(Math.random() * 6) + 10;

// Array of 10-15 Integers Ranging From 0-99
function getRandomNumbers(count) {
  const numbers = [];

  for (let i = 0; i < count; i++) {
    const randomNumber = Math.floor(Math.random() * 100);
    numbers.push(randomNumber);
  }

  return numbers;
}

console.log("Generating Array...");
const treeArray = getRandomNumbers(randomCount);
console.log(treeArray);

console.log("Generating Binary Search Tree...");
const testTree = new Tree(treeArray);
console.log(prettyPrint(testTree.root));

console.log("Testing Balance...");
console.log(testTree.isBalanced());

console.log("Printing Level Order...");
const levelArray = [];

testTree.levelOrderForEach((node) => {
  levelArray.push(node.data);
});
console.log(levelArray);

console.log("Printing Pre Order...");
const preArray = [];

testTree.preOrderForEach((node) => {
  preArray.push(node.data);
});
console.log(preArray);

console.log("Printing Post Order...");
const postArray = [];

testTree.postOrderForEach((node) => {
  postArray.push(node.data);
});
console.log(postArray);

console.log("Printing In Order...");
const inArray = [];

testTree.inOrderForEach((node) => {
  inArray.push(node.data);
});
console.log(inArray);

// Add 5 Numbers >100
console.log("Adding 101, 102, 103, 104, 105...");
testTree.insert(101);
testTree.insert(102);
testTree.insert(103);
testTree.insert(104);
testTree.insert(105);
console.log(prettyPrint(testTree.root));

console.log("Testing Balance...");
console.log(testTree.isBalanced());

console.log("Rebalancing Tree...");
testTree.rebalance();
console.log(prettyPrint(testTree.root));

console.log("Testing Balance...");
console.log(testTree.isBalanced());

console.log("Printing Level Order...");
const rebalancedLevelArray = [];

testTree.levelOrderForEach((node) => {
  rebalancedLevelArray.push(node.data);
});
console.log(rebalancedLevelArray);

console.log("Printing Pre Order...");
const rebalancedPreArray = [];

testTree.preOrderForEach((node) => {
  rebalancedPreArray.push(node.data);
});
console.log(rebalancedPreArray);

console.log("Printing Post Order...");
const rebalancedPostArray = [];

testTree.postOrderForEach((node) => {
  rebalancedPostArray.push(node.data);
});
console.log(rebalancedPostArray);

console.log("Printing In Order...");
const rebalancedInArray = [];

testTree.inOrderForEach((node) => {
  rebalancedInArray.push(node.data);
});
console.log(rebalancedInArray);
