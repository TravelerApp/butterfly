return (
  <div className="jamesCreatePage">
    <div className="jamesInputForm">
      <h1 className="jamesCreateTitle">Tell us about yourself:</h1>
      <form className="createProfileForm">
        <p id="JamesText">Full name: </p>
        <input
          className="jamesNameInput"
          type="text"
          placeholder="your name here .."
          onChange={this.fullNameChanged}
        />
        <h3 id="JamesText">Profile Picture: </h3>
        <input
          className="jamesPicInput"
          type="file"
          onChange={this.handleselectedFile}
        />
        <p id="JamesText">Origin country: </p>
        <select
          className="jamesCountryInput"
          onChange={this.orginCountryChanged.bind(this)}
        >
          <option>{this.state.currentCountry}</option>
          {this.state.allCountries.map((country, i) => (
            <option key={i} value={country.name}>
              {country}
            </option>
          ))}
        </select>
        <p id="JamesText">Primary language: </p>
        <select
          className="jamesLangInput"
          onChange={this.primaryLanguageChanged.bind(this)}
        >
          <option>{this.state.primaryLanguage}</option>
          {data.languages.map((language, i) => (
            <option key={i}>{language}</option>
          ))}
        </select>
        <h4 id="JamesText"> Interests: </h4>
        <div className="jamesInterestInput">
          {this.state.interests.map((interest, i) => (
            <div className="eachInterest" key={i}>
              <p className="createInterest">{interest.name}</p>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={() => this.interestChanged(interest.name)}
                />
                <span className="slider round" />
              </label>
            </div>
          ))}
        </div>

        <input
          className="JamesCreateButton"
          type="button"
          value="Create my profile"
          onClick={() => this.submit()}
        />
      </form>
    </div>
  </div>
);
