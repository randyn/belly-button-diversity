function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`)
    .then(data => {
      metadata_element = d3.select('#sample-metadata')
        .append('div')
        .selectAll('p');
      metadata = Object.entries(data);
      console.log(metadata);
      updated_metadata = metadata_element.data(metadata);
      
      updated_metadata.enter()
        .append('p')
        .merge(metadata_element)
        .text(d => `${d[0]}: ${d[1]}`);

      updated_metadata.exit().remove();
    });
}

const buildPieChartFromSampleData = (sample_data) => {
  plot_data = [{
    values: sample_data.sample_values.slice(0, 10),
    labels: sample_data.otu_ids.slice(0, 10),
    hovertext: sample_data.otu_labels.slice(0, 10),
    hoverinfo: 'text',
    type: 'pie'
  }];

  Plotly.newPlot('pie', plot_data)
  return sample_data;
}

const buildBubbleChartFromSampleData = (data) => {
  plot_data = [{
    x: data.otu_ids,
    y: data.sample_values,
    mode: 'markers',
    marker: {
      color: data.otu_ids.map(intToColorString),
      size: data.sample_values
    }
  }];
  console.log(plot_data);

  Plotly.newPlot('bubble', plot_data);
};

const intToColorString = (num) => {
  const red = Math.floor(num / (256**2));
  const blue = Math.floor(num / 256) % 256;
  const green = num % 256;
  return `0x${num}`;
}

function buildCharts(sample) {
  d3.json(`/samples/${sample}`)
    .then(buildPieChartFromSampleData)
    .then(buildBubbleChartFromSampleData)
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
