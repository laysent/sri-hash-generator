import React, { Component } from 'react';
import DragNDrop from './DragNDrop';
import './App.css';
import { getBase64HashFromUrl, getResourceHTML, getBase64HashFromFile } from './utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      sha256: false,
      sha384: true,
      sha512: false,
      resource: '',
      submitting: false,
    };
  }
  generate(getHash, filename) {
    this.setState({
      submitting: true,
      resource: '',
    });
    getHash()
      .then(
        (hash) => {
          this.setState({
            resource: getResourceHTML(filename, hash),
            submitting: false,
          });
        },
        () => {
          this.setState({
            submitting: false,
          });
        },
      );
  }
  getTypes() {
    return [
      this.state.sha256 && 'sha256',
      this.state.sha384 && 'sha384',
      this.state.sha512 && 'sha512',
    ].filter(_ => _);
  }
  onCopy = () => {
    if (navigator.clipboard) {
      this.setState({ submitting: true });
      navigator.clipboard
        .writeText(this.state.resource)
        .then(
          () => {
            alert('copied to clipboard');
            this.setState({ submitting: false });
          },
          () => {
            this.setState({ submitting: false });
          },
        );
    }
  }
  onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const types = this.getTypes();
    this.generate(() => getBase64HashFromFile(types, file), `./${file.name}`);
  }
  onHashTypeChange = (e) => {
    const type = e.target.id;
    this.setState({ [type]: !this.state[type] });
  }
  onUrlChange = (e) => {
    this.setState({
      url: e.target.value,
    });
  }
  onSubmit = () => {
    if (this.state.submitting) return;
    const url = this.state.url.trim();
    if (!url) return;
    const types = this.getTypes();
    this.generate(() => getBase64HashFromUrl(types, url), url);
  }
  render() {
    const { url, sha256, sha384, sha512, submitting, resource } = this.state;
    const isValid = url.trim().length > 0 && (sha256 || sha384 || sha512);
    return (
      <DragNDrop onDrop={this.onDrop} className="container">
        <main>
          <h1>Subresource Integrity (SRI) Generator</h1>
          <form onSubmit={this.onSubmit}>
            <div className="field-group">
              <p><label htmlFor="input">Enter url or drop file below</label></p>
              <input id="input" type="text" value={url} onChange={this.onUrlChange} />
            </div>
            <div className="field-group">
              <input id="sha256" type="checkbox" checked={sha256} onChange={this.onHashTypeChange} />
              <label htmlFor="sha256">sha256</label>
              <input id="sha384" type="checkbox" checked={sha384} onChange={this.onHashTypeChange} />
              <label htmlFor="sha384">sha384</label>
              <input id="sha512" type="checkbox" checked={sha512} onChange={this.onHashTypeChange} />
              <label htmlFor="sha512">sha512</label>
            </div>
            <button type="submit" disabled={!isValid || submitting}>Generate</button>
          </form>
          <section>
            <span>{resource}</span>
          </section>
          <div className="operation">
            <button
              aria-label="copy generated HTML with integrity"
              onClick={this.onCopy}
              className="btn-copy"
              disabled={!resource}
            >
              Copy
            </button>
          </div>
        </main>
        <footer>
          <span>© 2018 LaySent.</span>
          <a href="https://github.com/laysent/sri-hash-generator">Github</a>
        </footer>
      </DragNDrop>
    );
  }
}

export default App;
