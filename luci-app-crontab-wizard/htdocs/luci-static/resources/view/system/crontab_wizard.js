'use strict';
'require baseclass';
'require form';
'require ui';
'require view';
'require tools.widgets as widgets';

/*

  Copyright 2025 Rafał Wabik - IceG - From eko.one.pl forum
  
  MIT License
  
*/

return view.extend({
  colors: {
    light: {
      minute: '#fdd2d6',   // stronger light red
      hour: '#cfead1',     // stronger light green
      day: '#ffd8ad',      // stronger light orange
      month: '#bbdefb',    // stronger light blue
      weekday: '#e1bee7'   // stronger light purple
    },
    dark: {
      minute: '#5b2f35',   // lighter dark red for contrast
      hour: '#2f4732',     // lighter dark green
      day: '#4a3828',      // lighter dark orange
      month: '#30475e',    // lighter dark blue
      weekday: '#3a2f41'   // lighter dark purple
    }
  },

  getCurrentColors: function() {
    const isDarkMode = document.documentElement.getAttribute('data-darkmode') === 'true';
    return isDarkMode ? this.colors.dark : this.colors.light;
  },

  getBadgeTextColor: function() {
    const isDarkMode = document.documentElement.getAttribute('data-darkmode') === 'true';
    return isDarkMode ? '#ffffff' : '#111111';
  },

  addStyles: function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
    .ifacebox .span-40  { grid-column: span 2; }
    .ifacebox .span-80  { grid-column: span 4; }
    .ifacebox .span-160 { grid-column: span 8; }
    .ifacebox .span-320 { grid-column: span 8; }
    @media (max-width: 560px) {
      .ifacebox .span-320 { grid-column: span 8 !important; }
    }
    :root {
      --tile-free: #eceff1;
      --tile-active: #34c759;
      --tile-text: #263238;
      --tile-text-on-active: #ffffff;
      --iface-head-bg: #f8f8f8;
      --app-id-font-color: #454545;
      --border-color-soft: #eceff1;
      --border-color-medium: #cfd8dc;
      --border-color-strong: #90a4ae;
      --tile-border: #b0bec5;
      --cron-minute: #fdd2d6;
      --cron-hour: #cfead1;
      --cron-day: #ffd8ad;
      --cron-month: #bbdefb;
      --cron-weekday: #e1bee7;
      --badge-text: #111111;
      --badge-border: rgba(0,0,0,.15);
    }
    :root[data-darkmode="true"] {
      --tile-free: #2a2f34;
      --tile-active: #2ecc71;
      --tile-text: #e5e7eb;
      --tile-text-on-active: #ffffff;
      --iface-head-bg: #1f2327;
      --border-color-soft: #2a2f34;
      --border-color-medium: #3a4146;
      --border-color-strong: #6b737a;
      --app-id-font-color: #f6f6f6;
      --tile-border: #54616b;
      --cron-minute: #8b4f5a;
      --cron-hour: #4f6b52;
      --cron-day: #7a5838;
      --cron-month: #4a6b8e;
      --cron-weekday: #5a4f71;
      --badge-text: #ffffff;
      --badge-border: rgba(255,255,255,.2);
    }
    
    .cron-minute-head { background: var(--cron-minute) !important; }
    .cron-hour-head { background: var(--cron-hour) !important; }
    .cron-day-head { background: var(--cron-day) !important; }
    .cron-month-head { background: var(--cron-month) !important; }
    .cron-weekday-head { background: var(--cron-weekday) !important; }
    
    /* Normal mode */
    :root .cron-minute-head {
      color: #263238 !important;
    }
    :root .cron-hour-head {
      color: #263238 !important;
    }
    :root .cron-day-head {
      color: #263238 !important;
    }
    :root .cron-month-head {
      color: #263238 !important;
    }
    :root .cron-weekday-head {
      color: #263238 !important;
    }
    
    /* Dark mode */
    :root[data-darkmode="true"] .cron-minute-head {
      color: #ffcdd2 !important;
    }
    :root[data-darkmode="true"] .cron-hour-head {
      color: #c8e6c9 !important;
    }
    :root[data-darkmode="true"] .cron-day-head {
      color: #ffe0b2 !important;
    }
    :root[data-darkmode="true"] .cron-month-head {
      color: #bbdefb !important;
    }
    :root[data-darkmode="true"] .cron-weekday-head {
      color: #e1bee7 !important;
    }
    
    .ifacebox .tile {
      font-weight: normal;
    }

    .cron-badge {
      display: inline-block;
      padding: 3px 6px;
      border-radius: 6px;
      border: 1px solid var(--badge-border);
      box-shadow: 0 1px 1px var(--badge-shadow), inset 0 1px 0 rgba(255,255,255,.08);
      font-weight: 600;
      letter-spacing: .2px;
    }

    .cbi-input-text {
      text-align: left !important;
    }

    #cron_preview_text {
      text-align: left !important;
    }

    #cron_preview {
      height: 40px !important;
      min-height: 40px !important;
      max-height: 40px !important;
      line-height: 26px;
      display: flex;
      align-items: center;
    }

    .cron-actions {
      margin-top: 1em;
      display: flex;
      justify-content: flex-end;
      gap: .6em;
    }
  `;
    document.head.appendChild(style);
  },

  badge: function(bg, content){
    const color = this.getBadgeTextColor();
    return '<span class="cron-badge" style="background:' + bg + '; color:' + color + '">' + content + '</span>';
  },

  generateCronValues: function(selectId, checkboxId, isRange = false) {
    if (!checkboxId) {
      let select = document.getElementById(selectId);
      return select.value || '*';
    }
    
    let checkbox = document.getElementById(checkboxId);
    let select = document.getElementById(selectId);

    if (!checkbox || !checkbox.checked) {
      return select.value || '*';
    }

    if (isRange) {
      let value = select.value;
      if (value === '*' || value === '') return '*';
      return '*/' + value;
    } else {
      return select.value || '*';
    }
  },

  updateCronPreview: function() {
    let minute = this.generateCronValues('minute_select', 'minute_checkbox', true);
    let hour = this.generateCronValues('hour_select', 'hour_checkbox', true);
    let day = this.generateCronValues('day_select', 'day_checkbox', true);
    let month = this.generateCronValues('month_select');
    let weekday = this.generateCronValues('weekday_select');
    let command = document.getElementById('cron_command_input').value || '';

    let isMinuteChanged = minute !== '*';
    let isHourChanged = hour !== '*';
    let isDayChanged = day !== '*';
    let isMonthChanged = month !== '*';
    let isWeekdayChanged = weekday !== '*';
    let isCommandChanged = command !== '';

    let colors = this.getCurrentColors();

    let cronHtml = '';
    cronHtml += isMinuteChanged ? this.badge(colors.minute, minute) : minute;
    cronHtml += ' ';
    cronHtml += isHourChanged ? this.badge(colors.hour, hour) : hour;
    cronHtml += ' ';
    cronHtml += isDayChanged ? this.badge(colors.day, day) : day;
    cronHtml += ' ';
    cronHtml += isMonthChanged ? this.badge(colors.month, month) : month;
    cronHtml += ' ';
    cronHtml += isWeekdayChanged ? this.badge(colors.weekday, weekday) : weekday;
    cronHtml += ' ';
    cronHtml += isCommandChanged ? '<span class="cron-badge" style="background:var(--border-color-medium); color:var(--badge-text)">' + command + '</span>' : command;

    document.getElementById('cron_preview').innerHTML = cronHtml;

    let plainCronCommand = minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + weekday + ' ' + command;
    document.getElementById('cron_preview_text').value = plainCronCommand;
  },

  // Generate select options
  generateOptions: function(start, end, labels) {
    let options = [E('option', { value: '*' }, '*')];
    
    if (labels) {
      // months, weekdays
      for (let i = 0; i < labels.length; i++) {
        options.push(E('option', { value: (start + i).toString() }, labels[i]));
      }
    } else {
      // numeric
      for (let i = start; i <= end; i++) {
        options.push(E('option', { value: i.toString() }, i.toString()));
      }
    }
    
    return options;
  },

  render: function(){
    let self = this;

    this.addStyles();

    return E('div', { class:'cbi-map' }, [
      E('h4', {}, [ _('Graphical Crontab Configurator') ]),
        E('div', { 'class': 'cbi-section-descr fade-in' }, [_('A super simple graphical configurator for crontab.') ]),

        E('div', { 'style': 'display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));margin-bottom:1em;gap:1em' }, [
          // Minute
          E('div', { 'class': 'ifacebox', 'style': 'margin:.25em;width:100%' }, [
            E('div', { 'class': 'ifacebox-head cron-minute-head', 'style': 'font-weight:bold;padding:8px;color:#ffffff;' }, [ _('Minute') ]),
            E('div', { 'class': 'ifacebox-body', 'style': 'padding:8px' }, [
              E('select', {
                'id': 'minute_select',
                'class': 'cbi-input-select',
                'style': 'width:100%; margin-bottom:8px',
                'change': ui.createHandlerFn(this, 'updateCronPreview')
              }, this.generateOptions(0, 59)),
              E('div', { 'style': 'display:flex; align-items:center; gap:5px' }, [
                E('input', { 
                  'type': 'checkbox', 
                  'id': 'minute_checkbox',
                  'change': ui.createHandlerFn(this, 'updateCronPreview')
                }),
                E('label', { 'for': 'minute_checkbox', 'style': 'font-size:12px' }, _('every specified minute period'))
              ])
            ])
          ]),

          // Hour
          E('div', { 'class': 'ifacebox', 'style': 'margin:.25em;width:100%' }, [
            E('div', { 'class': 'ifacebox-head cron-hour-head', 'style': 'font-weight:bold;padding:8px;color:#ffffff;' }, [ _('Hour') ]),
            E('div', { 'class': 'ifacebox-body', 'style': 'padding:8px' }, [
              E('select', {
                'id': 'hour_select',
                'class': 'cbi-input-select',
                'style': 'width:100%; margin-bottom:8px',
                'change': ui.createHandlerFn(this, 'updateCronPreview')
              }, this.generateOptions(0, 23)),
              E('div', { 'style': 'display:flex; align-items:center; gap:5px' }, [
                E('input', { 
                  'type': 'checkbox', 
                  'id': 'hour_checkbox',
                  'change': ui.createHandlerFn(this, 'updateCronPreview')
                }),
                E('label', { 'for': 'hour_checkbox', 'style': 'font-size:12px' }, _('every specified hour period'))
              ])
            ])
          ]),

          // Day
          E('div', { 'class': 'ifacebox', 'style': 'margin:.25em;width:100%' }, [
            E('div', { 'class': 'ifacebox-head cron-day-head', 'style': 'font-weight:bold;padding:8px;color:#ffffff;' }, [ _('Day') ]),
            E('div', { 'class': 'ifacebox-body', 'style': 'padding:8px' }, [
              E('select', {
                'id': 'day_select',
                'class': 'cbi-input-select',
                'style': 'width:100%; margin-bottom:8px',
                'change': ui.createHandlerFn(this, 'updateCronPreview')
              }, this.generateOptions(1, 31)),
              E('div', { 'style': 'display:flex; align-items:center; gap:5px' }, [
                E('input', { 
                  'type': 'checkbox', 
                  'id': 'day_checkbox',
                  'change': ui.createHandlerFn(this, 'updateCronPreview')
                }),
                E('label', { 'for': 'day_checkbox', 'style': 'font-size:12px' }, _('every specified day'))
              ])
            ])
          ]),

          // Month
          E('div', { 'class': 'ifacebox', 'style': 'margin:.25em;width:100%' }, [
            E('div', { 'class': 'ifacebox-head cron-month-head', 'style': 'font-weight:bold;padding:8px;color:#ffffff;' }, [ _('Month') ]),
            E('div', { 'class': 'ifacebox-body', 'style': 'padding:8px' }, [
              E('select', {
                'id': 'month_select',
                'class': 'cbi-input-select',
                'style': 'width:100%',
                'change': ui.createHandlerFn(this, 'updateCronPreview')
              }, this.generateOptions(1, 12, [
                _('January'), _('February'), _('March'), _('April'), _('May'), _('June'),
                _('July'), _('August'), _('September'), _('October'), _('November'), _('December')
              ]))
            ])
          ]),

          // Weekday
          E('div', { 'class': 'ifacebox', 'style': 'margin:.25em;width:100%' }, [
            E('div', { 'class': 'ifacebox-head cron-weekday-head', 'style': 'font-weight:bold;padding:8px;color:#ffffff;' }, [ _('Weekday') ]),
            E('div', { 'class': 'ifacebox-body', 'style': 'padding:8px' }, [
              E('select', {
                'id': 'weekday_select',
                'class': 'cbi-input-select',
                'style': 'width:100%',
                'change': ui.createHandlerFn(this, 'updateCronPreview')
              }, this.generateOptions(0, 6, [
                _('Sunday'), _('Monday'), _('Tuesday'), _('Wednesday'), _('Thursday'), _('Friday'), _('Saturday')
              ]))
            ])
          ])
        ]),

        E('label', { 'style': 'font-weight:bold; display:block; margin-bottom:5px;' }, _('Command to execute:')),
        E('input', {
          'id': 'cron_command_input',
          'class': 'cbi-input-text',
          'style': 'width:100%; margin-bottom:10px; text-align:center;',
          'blur': ui.createHandlerFn(this, 'updateCronPreview')
        }),

      E('div', { 'style': 'margin-top:1em;' }, [
        E('label', { 'style': 'font-weight:bold; display:block; margin-bottom:5px;' }, _('Command preview:')),
        E('div', {
          'id': 'cron_preview',
          'style': 'width:100%; margin-bottom:10px; font-family:monospace; border:1px solid var(--border-color-medium); padding:8px; background:var(--tile-free); border-radius:6px; color:var(--tile-text);'
        }),
      ]),

      E('div', { 'style': 'margin-top:1em;' }, [
        E('label', { 'style': 'font-weight:bold; display:block; margin-bottom:5px;' }, _('Generated cron command:')),
        E('input', {
          'id': 'cron_preview_text',
          'class': 'cbi-input-text',
          'style': 'width:100%; margin-bottom:10px; font-family:monospace;',
          'readonly': true,
          'placeholder': _('Cron command for copying'),
          'value': '* * * * * '
        })
      ]),

      // BUTTONS
      E('div', { 'class': 'cron-actions' }, [

        E('button', {
          'class': 'cbi-button cbi-button-neutral',
          'click': ui.createHandlerFn(this, function(){
            document.getElementById('minute_select').value = '*';
            document.getElementById('hour_select').value = '*';
            document.getElementById('day_select').value = '*';
            document.getElementById('month_select').value = '*';
            document.getElementById('weekday_select').value = '*';
            document.getElementById('cron_command_input').value = '';

            let minuteCheckbox = document.getElementById('minute_checkbox');
            let hourCheckbox = document.getElementById('hour_checkbox');
            let dayCheckbox = document.getElementById('day_checkbox');

            if (minuteCheckbox) minuteCheckbox.checked = false;
            if (hourCheckbox) hourCheckbox.checked = false;
            if (dayCheckbox) dayCheckbox.checked = false;

            this.updateCronPreview();
          })
        }, _('Reset all changes made'))
      ])
    ]);
  },

  handleSaveApply: null,
  handleSave: null,
  handleReset: null
});
