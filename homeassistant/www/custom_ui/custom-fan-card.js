class CustomFanCard extends Polymer.Element {

    static get template() {
        return Polymer.html`
            <style is="custom-style" include="iron-flex iron-flex-alignment"></style>
            <style>
                :host {
                    line-height: inherit;
                }
                .speed {
                    min-width: 34px;
                    max-width: 34px;
                    height: 34px;
                    margin-left: 2px;
                    margin-right: 2px;
                    background-color: var(--dark-accent-color);
	                border: 1px var(--dark-theme-disabled-color);
                    border-radius: 4px;
	                font-size: 11px !important;
                    text-align: center;
	                float: right !important;
                    padding: 1px;
                    font-family: inherit;
	       }
            </style>
            <hui-generic-entity-row hass="[[hass]]" config="[[_config]]">
                <div class='horizontal justified layout' on-click="stopPropagation">
                    <button
                        class='speed'
                        style='[[_offColor]]'
                        toggles name="off"
			            percentage="0"
                        on-click='setSpeed'
                        disabled='[[_isOffState]]'>OFF</button>
		            <button
                        class='speed'
                        style='[[_lowOnColor]]'
                        toggles name="low"
			            percentage="33"
                        on-click='setSpeed'
                        disabled='[[_isOnLow]]'>LOW</button>
                    <button
                        class='speed'
                        style='[[_medOnColor]]'
                        toggles name="medium"
			            percentage="66"
                        on-click='setSpeed'
                        disabled='[[_isOnMed]]'>MED</button>
                    <button
                        class='speed'
                        style='[[_highOnColor]]'
                        toggles name="high"
			            percentage="100"
                        on-click='setSpeed'
                        disabled='[[_isOnHigh]]'>HIGH</button>
                </div>
            </hui-generic-entity-row>
        `;
    }

    static get properties() {
        return {
            hass: {
                type: Object,
                observer: 'hassChanged'
            },
            _config: Object,
            _stateObj: Object,
            _lowOnColor: String,
            _medOnColor: String,
            _highOnColor: String,
            _offColor: String,
            _isOffState: Boolean,
            _isOnLow: Boolean,
            _isOnMed: Boolean,
            _isOnHigh: Boolean
        }
    }

    setConfig(config) {
        this._config = config;
    }

    hassChanged(hass) {
        let stateObj = hass.states[this._config.entity],
            low = false,
            med = false,
            high = false,
            off = false;

        if (stateObj && stateObj.attributes) {
            if (stateObj.state == 'on') {
                low = stateObj.attributes.percentage == 33;
                med = stateObj.attributes.percentage == 66;
                high = stateObj.attributes.percentage == 100;
            } else
                off = true;
        }

        let style = 'background-color: var(--dark-primary-color); color: white;';
        this.setProperties({
            _stateObj: stateObj,
            _isOffState: stateObj.state == 'off',
            _isOnLow: low,
            _isOnMed: med,
            _isOnHigh: high,
            _lowOnColor: low ? style : '',
            _medOnColor: med ? style : '',
            _highOnColor: high ? style : '',
            _offColor: off ? style : ''
        });
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    setSpeed(e) {
        this.hass.callService('fan', 'set_percentage', {
            entity_id: this._config.entity,
            percentage: +e.currentTarget.getAttribute('percentage')
        });
    }
}

customElements.define('custom-fan-card', CustomFanCard);
