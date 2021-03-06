/*
 * Copyright (c) 2002-2017 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { connect } from 'preact-redux'
import * as actions from 'shared/modules/settings/settingsDuck'
import { Drawer, DrawerBody, DrawerHeader, DrawerSection, DrawerSectionBody, DrawerSubHeader } from 'browser-components/drawer'
import { RadioSelector, CheckboxSelector } from 'browser-components/Form'
import { StyledSetting, StyledSettingLabel, StyledSettingTextInput } from './styled'

const visualSettings =
  [
    {
      title: 'User Interface',
      settings: [
        {
          theme: {
            displayName: 'Theme',
            type: 'radio',
            options: ['normal', 'dark', 'outline']
          }
        }
      ]
    },
    {
      title: 'Preferences',
      settings: [
        {
          showSampleScripts: {
            displayName: 'Show sample scripts',
            tooltip: 'Show sample scripts in favorites drawer.',
            type: 'checkbox'
          }
        }
      ]
    },
    {
      title: 'Result Frames',
      settings: [
        {
          maxHistory: {
            displayName: 'Max History',
            tooltip: 'Max number of history entries. When reached, old entries gets retired.'
          }
        }
      ]
    },
    {
      title: 'Graph Visualization',
      settings: [
        {
          initialNodeDisplay: {
            displayName: 'Initial Node Display',
            tooltip: 'Limit number of nodes displayed on first load of the graph visualization.'
          }
        },
        {
          maxNeighbours: {
            displayName: 'Max Neighbours',
            tooltip: 'Limit exploratary queries to this limit.'
          }
        }
      ]
    }
  ]

export const Settings = ({settings, onSettingsSave = () => {}}) => {
  const mappedSettings = visualSettings.map((visualSetting, i) => {
    const title = <DrawerSubHeader>{visualSetting.title}</DrawerSubHeader>
    const mapSettings = visualSetting.settings.map((settingObj, i) => {
      const setting = Object.keys(settingObj)[0]
      const visual = settingObj[setting].displayName
      const tooltip = settingObj[setting].tooltip || ''

      if (!settingObj[setting].type || settingObj[setting].type === 'input') {
        return (<StyledSetting key={i}>
          <StyledSettingLabel>{visual}</StyledSettingLabel>
          <StyledSettingTextInput onChange={(event) => {
            settings[setting] = event.target.value
            onSettingsSave(settings)
          }} defaultValue={settings[setting]} title={[tooltip]} />
        </StyledSetting>)
      } else if (settingObj[setting].type === 'radio') {
        return (<StyledSetting key={i}>
          <StyledSettingLabel>{visual}</StyledSettingLabel>
          <RadioSelector options={settingObj[setting].options} onChange={(event) => {
            settings[setting] = event.target.value
            onSettingsSave(settings)
          }} selectedValue={settings[setting]} />
        </StyledSetting>)
      } else if (settingObj[setting].type === 'checkbox') {
        return (<StyledSetting key={i}>
          <CheckboxSelector onChange={(event) => {
            settings[setting] = event.target.checked
            onSettingsSave(settings)
          }} checked={settings[setting]} />
          <StyledSettingLabel>{visual}</StyledSettingLabel>
        </StyledSetting>)
      }
    })
    return (
      <div>
        {title}
        {mapSettings}
      </div>
    )
  })

  return (
    <Drawer id='db-settings'>
      <DrawerHeader>Browser Settings</DrawerHeader>
      <DrawerBody>
        <DrawerSection>
          <DrawerSectionBody>
            {mappedSettings}
          </DrawerSectionBody>
        </DrawerSection>
      </DrawerBody>
    </Drawer>
  )
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSettingsSave: (settings) => {
      dispatch(actions.update(settings))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
