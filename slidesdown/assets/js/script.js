function calcularRutaRelativa(rutaBase, otraRuta) {
    var segmentosBase = rutaBase.split('/');
    var segmentosOtraRuta = otraRuta.split('/');
  
    // Eliminar el último segmento (nombre de archivo) si es un archivo
    segmentosBase.pop();
    segmentosOtraRuta.pop();
  
    // Encontrar la longitud común de los segmentos
    var longitudComun = Math.min(segmentosBase.length, segmentosOtraRuta.length);
  
    // Encontrar el índice donde difieren las rutas
    var indiceDiferencia = 0;
    for (var i = 0; i < longitudComun; i++) {
      if (segmentosBase[i] !== segmentosOtraRuta[i]) {
        break;
      }
      indiceDiferencia++;
    }
  
    // Construir la ruta relativa
    var rutaRelativa = '';
    for (var i = indiceDiferencia; i < segmentosBase.length; i++) {
      rutaRelativa += '../';
    }
  
    for (var i = indiceDiferencia; i < segmentosOtraRuta.length; i++) {
      rutaRelativa += segmentosOtraRuta[i] + '/';
    }
  
    // Eliminar la barra al final
    rutaRelativa = rutaRelativa.replace(/\/$/, '');
  
    return rutaRelativa;
  }

function queryParentSelector(element, selector) {
  var parent = element.parentElement;
  while (parent) {
    if (parent.matches(selector)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

function eliminarUltimoElementoDelPath(url) {
  var urlObj = new URL(url);
  var pathSegments = urlObj.pathname.split('/');

  // Eliminar el último elemento del array
  pathSegments.pop();

  // Actualizar el pathname en la URL
  urlObj.pathname = pathSegments.join('/');

  // Obtener la URL modificada como cadena
  var nuevaUrl = urlObj.href;

  return nuevaUrl;
}

function frameworks_usage_dataset_preprocess(data) {
  var datasets = [];
  const labels = data.stats.map(d => d.key);
  var frameworks_labels = data.stats[0].stat.frameworks_prop;
  if ("meta" in data) {
    frameworks_labels = Object.keys(data.meta);
  }
  for (const framework of frameworks_labels) {
    datasets.push({
      label: data.meta[framework].name,
      data: data.stats.map(d => d.stat.frameworks_prop[framework]),
      github_data: data.stats.map(d => d.stat.github_frameworks_count[framework]),
      backgroundColor: data.meta[framework].c,
      fill: true,
    });
  }
  return [labels, datasets];
}

function createChartFromURL(canvas, preprocess_fn) {
  // today = new Date();
  // url = `https://paperswithcode.com/api/stats/?type=quarter&from=2019-12-01&to=${today.toISOString().split('T')[0]}`;
  
  // Los datos tienen un formato como el siguiente:
  /*
  "stats": [
    {
      "type": "quarter",
      "key": "2019-Q4",
      "date": "2019-12-31",
      "stat": {
        "num_pwc": 3562,
        "prop_pwc": 0.2907517753652763,
        "num_paper": 12251,
        "num_github": 5220,
        "frameworks_prop": {
          "tf": 0.2184166198764739,
          "jax": 0.009264458169567658,
          "none": 0.35569904548006737,
          "mxnet": 0.005895564289724873,
          "torch": 0.0011229646266142617,
          "caffe2": 0.0008422234699606962,
          "paddle": 0.010948905109489052,
          "pytorch": 0.5185289163391353,
          "mindspore": 0.015721504772599662
        },
        "frameworks_count": {
          "tf": 778,
          "jax": 33,
          "none": 1267,
          "mxnet": 21,
          "torch": 4,
          "caffe2": 3,
          "paddle": 39,
          "pytorch": 1847,
          "mindspore": 56
        },
        "github_frameworks_prop": {
          "tf": 0.2467432950191571,
          "jax": 0.0015325670498084292,
          "none": 0.30019157088122606,
          "mxnet": 0.0038314176245210726,
          "torch": 0.0017241379310344827,
          "caffe2": 0.00210727969348659,
          "paddle": 0.0034482758620689655,
          "pytorch": 0.4404214559386973,
          "mindspore": 0
        },
        "github_frameworks_count": {
          "tf": 1288,
          "jax": 8,
          "none": 1567,
          "mxnet": 20,
          "torch": 9,
          "caffe2": 11,
          "paddle": 18,
          "pytorch": 2299,
          "mindspore": 0
        }
      }
    },
    ...
  ]
  */
  url = canvas.dataset["chartUrl"];

  // Se establece la opcion no-cors para que el navegador no bloquee la peticion
  // Se agrega el header 'Access-Control-Allow-Origin' para que el servidor permita la peticion

  fetch(
    //url, {method: 'GET', mode: 'no-cors', headers: {'Access-Control-Allow-Origin': '*'}}
    url
  ).then(response => response.json()
  ).then(data => {
    const [labels, datasets] = preprocess_fn(data);
    const dataArea = {
      labels: labels,
      datasets: datasets
    };
    createAreaChart(
      canvas, dataArea,
      title=canvas.dataset["chartTitle"],
      xlabel=canvas.dataset["chartXlabel"],
      ylabel=canvas.dataset["chartYlabel"]
    );
  }).catch(error => console.error('Error:', error));
}

function createAreaChart(canvas, data, title="", xlabel="", ylabel="") {
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  var ctx = canvas.getContext('2d');
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point:{
            radius: 0
        },
        line: {
            borderWidth: 0
        }
      },
      plugins: {
        title: {
          display: true,
          text: title
        },
        tooltip: {
          callbacks:{
            // Se agrega la info de los repos que esta en data[0].github_data
            label: function(context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += (context.parsed.y * 100).toFixed(2) + '%';
              }
              if (context.dataset.github_data) {
                label += ` (${context.dataset.github_data[context.dataIndex]} repos)`;
              }
              return label;
            }
          }
        },
        plugins: {
          colors: {
            enabled: true
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: {
          stacked: true,
          type: "category",
          title: {
            display: true,
            text: xlabel
          },
          
        },
        y: {
          // type: "linear",
          // min: 0,
          // max: 1,
          stacked: true,
          title: {
            display: true,
            text: ylabel
          },
          ticks: {
            callback: function(value) {
              return value * 100 + '%'; // Muestra los valores en formato porcentaje
            }
          }
        }
      }
    }
  };

  canvas.chart = new Chart(ctx, config);
}
