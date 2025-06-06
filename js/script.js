const nodesArray = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E' },
  { id: 'F', label: 'F' },
];

const edgesArray = [
  { id: 1, from: 'A', to: 'B', label: '4', value: 4 },
  { id: 2, from: 'A', to: 'C', label: '2', value: 2 },
  { id: 3, from: 'B', to: 'C', label: '5', value: 5 },
  { id: 4, from: 'B', to: 'D', label: '10', value: 10 },
  { id: 5, from: 'C', to: 'D', label: '3', value: 3 },
  { id: 6, from: 'D', to: 'E', label: '4', value: 4 },
  { id: 7, from: 'E', to: 'F', label: '11', value: 11 },
];

let selected = [];

const container = document.getElementById('mynetwork');
const data = {
  nodes: new vis.DataSet(nodesArray),
  edges: new vis.DataSet(edgesArray),
};
const options = {
  physics: false,
  edges: {
    font: { align: 'top' },
    arrows: 'to',
    color: '#848484'
  },
  nodes: {
    shape: 'circle',
    color: { background: '#97C2FC', border: '#2B7CE9' }
  }
};

const network = new vis.Network(container, data, options);

// Membuat graph untuk Dijkstra
function getGraph() {
  const graph = {};
  data.nodes.forEach(n => graph[n.id] = {});
  data.edges.forEach(e => {
    graph[e.from][e.to] = Number(e.label);
    graph[e.to][e.from] = Number(e.label);
  });
  return graph;
}

// Dijkstra
function dijkstra(graph, start, end) {
  const distances = {}, prev = {}, visited = new Set(), queue = [];
  for (let node in graph) {
    distances[node] = Infinity;
    prev[node] = null;
  }
  distances[start] = 0;
  queue.push([start, 0]);

  while (queue.length) {
    queue.sort((a, b) => a[1] - b[1]);
    const [current] = queue.shift();
    visited.add(current);

    for (let neighbor in graph[current]) {
      if (visited.has(neighbor)) continue;
      const newDist = distances[current] + graph[current][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        prev[neighbor] = current;
        queue.push([neighbor, newDist]);
      }
    }
  }

  const path = [];
  let curr = end;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  return { distance: distances[end], path };
}

// Klik Node
network.on("click", function (params) {
  if (params.nodes.length === 1) {
    const nodeId = params.nodes[0];
    if (!selected.includes(nodeId)) {
      if (selected.length < 2) {
        selected.push(nodeId);
        highlightNode(nodeId, "green");
      }
    }
    if (selected.length === 2) {
      const graph = getGraph();
      const result = dijkstra(graph, selected[0], selected[1]);
      displayResult(result);
    }
  }

  // Ganti bobot edge (opsional)
  if (params.edges.length === 1) {
    const edgeId = params.edges[0];
    const edge = data.edges.get(edgeId);
    const newWeight = prompt(`Masukkan bobot baru untuk edge ${edge.from} → ${edge.to}:`, edge.label);
    if (newWeight !== null && !isNaN(newWeight)) {
      data.edges.update({ id: edgeId, label: newWeight, value: Number(newWeight) });
    }
  }
});

// Menampilkan hasil
function displayResult({ distance, path }) {
  document.getElementById("info").innerHTML = `
    <strong>Jarak terpendek:</strong> ${distance}<br>
    <strong>Rute:</strong> ${path.join(" → ")}
  `;
  highlightPath(path);
}

// Highlight
function highlightNode(id, color) {
  data.nodes.update({ id, color: { background: color } });
}
function highlightPath(path) {
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i], to = path[i + 1];
    const edge = data.edges.get().find(e => (e.from === from && e.to === to) || (e.from === to && e.to === from));
    if (edge) {
      data.edges.update({ id: edge.id, color: { color: 'red' }, width: 3 });
    }
  }
}

// Reset
function resetGraph() {
  selected = [];
  data.nodes.get().forEach(n => data.nodes.update({ id: n.id, color: { background: undefined } }));
  data.edges.get().forEach(e => data.edges.update({ id: e.id, color: { color: '#848484' }, width: 1 }));
  document.getElementById("info").textContent = "";
}

// Dijkstra Manual
function runManualDijkstra() {
  const start = document.getElementById("startNode").value.trim().toUpperCase();
  const end = document.getElementById("endNode").value.trim().toUpperCase();
  if (!start || !end || !data.nodes.get(start) || !data.nodes.get(end)) {
    alert("Node tidak valid.");
    return;
  }
  resetGraph();
  highlightNode(start, 'green');
  highlightNode(end, 'green');
  const result = dijkstra(getGraph(), start, end);
  displayResult(result);
}
