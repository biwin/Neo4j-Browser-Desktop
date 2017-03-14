import { Component } from 'preact'
import FrameTemplate from './FrameTemplate'
import { CypherFrameButton } from 'browser-components/buttons'
import FrameSidebar from './FrameSidebar'
import { VisualizationIcon, TableIcon, AsciiIcon, CodeIcon, PlanIcon } from 'browser-components/icons/Icons'
import QueryPlan from './Planner/QueryPlan'
import TableView from './Views/TableView'
import AsciiView from './Views/AsciiView'
import CodeView from './Views/CodeView'
import bolt from 'services/bolt/bolt'
import Visualization from './Visualization'

class CypherFrame extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openView: 'visualization'
    }
  }

  onNavClick (viewName) {
    this.setState({openView: viewName})
  }

  componentWillReceiveProps (nextProps) {
    let rows
    let plan
    let nodesAndRelationships
    if (nextProps.request.status === 'success' && nextProps.request.result !== this.props.request.result) {
      if (nextProps.request.result.records && nextProps.request.result.records.length > 0) {
        nodesAndRelationships = bolt.extractNodesAndRelationshipsFromRecords(nextProps.request.result.records)
        rows = bolt.recordsToTableArray(nextProps.request.result.records)
      }

      plan = bolt.extractPlan(nextProps.request.result)

      if (plan) { this.setState({openView: 'plan'}) }
    } else {
      this.setState({nodesAndRelationships, rows, plan})
    }
  }

  sidebar () {
    return (
      <FrameSidebar>
        <CypherFrameButton selected={this.state.openView === 'visualization'} icon={<VisualizationIcon />} onClick={() => {
          this.setState({openView: 'visualization'})
        }} />
        <CypherFrameButton selected={this.state.openView === 'table'} icon={<TableIcon />} onClick={() => {
          this.setState({openView: 'table'})
        }} />
        <CypherFrameButton selected={this.state.openView === 'text'} icon={<AsciiIcon />} onClick={() => {
          this.setState({openView: 'text'})
        }} />
        <CypherFrameButton selected={this.state.openView === 'code'} icon={<CodeIcon />} onClick={() => {
          this.setState({openView: 'code'})
        }} />
        {
          (this.state.plan || bolt.extractPlan(this.props.request.result || false)
            ? <CypherFrameButton selected={this.state.openView === 'plan'} icon={<PlanIcon />} onClick={() =>
            this.setState({openView: 'plan'})
              } />
            : null)
        }
      </FrameSidebar>
    )
  }

  render () {
    const frame = this.props.frame
    const errors = this.props.request.status === 'error' ? this.props.request.result.fields : false
    const result = this.props.request.result || false
    const plan = this.state.plan || bolt.extractPlan(result)
    const requestStatus = this.props.request.status

    let frameContents = <pre>{JSON.stringify(result, null, 2)}</pre>

    if ((result.records) || plan) {
      if (result.records && result.records.length > 0) {
        this.state.rows = this.state.rows || bolt.recordsToTableArray(result.records)
      }

      switch (this.state.openView) {
        case 'text':
          frameContents = <AsciiView rows={this.state.rows} />
          break
        case 'table':
          frameContents = <TableView data={this.state.rows} />
          break
        case 'visualization':
          frameContents = <Visualization records={result.records} />
          break
        case 'code':
          frameContents = <CodeView query={this.props.frame.cmd} request={this.props.request} />
          break
        case 'plan':
          frameContents = <QueryPlan plan={plan} />
          break
        default:
          frameContents = <Visualization records={result.records} />
      }
    } else if (errors) {
      frameContents = (
        <div>
          {errors[0].code}
          <pre>{errors[0].message}</pre>
        </div>
      )
    } else if (result) {
      frameContents = (
        <div>
          <pre>{JSON.stringify(result, null, '\t')}</pre>
        </div>
      )
    } else if (requestStatus === 'pending') {
      frameContents = (
        <div>
          Running query...
        </div>
      )
    }
    return (
      <FrameTemplate
        sidebar={this.sidebar.bind(this)}
        header={frame}
        contents={frameContents}
      />
    )
  }
}
export default CypherFrame
