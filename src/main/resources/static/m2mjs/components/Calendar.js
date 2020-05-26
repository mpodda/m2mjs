/**
 * ---------------------
 * -- m2mjs Component --
 * ---------------------
 */

/**
 * Version 2.0
 */

/**
 * History: Apply Observer - Obserbable pattern
 *
 */

/* 
  -------------------------
  -- Calendar Parameters --
  -------------------------
*/
class CalendarParameters {

  /**
   * @constructor
   */
  constructor() {

    /** @private */ this._isDateAndTime = false;

    /** @private */ this._weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    /** @private */ this._monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    /** @private */ this._monthShortNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    /** @private */ this._notInMothClassName = "notInMoth";
    /** @private */ this._todayClassName = "today";
    /** @private */ this._disabledClassName = "";
    /** @private */ this._calendarDayClassName = "calendarDay";
    /** @private */ this._dateFormat = "dd/MM/yyyy";
    /** @private */ this._dateSeparator = "/";
    /** @private */ this._localeString = "el-GR";
  }

  set weekDays(weekDays) {
    this._weekDays = weekDays;
  }

  get weekDays() {
    return this._weekDays;
  }

  set monthNames(value) {
    this._monthNames = value;
  }

  get monthNames() {
    return this._monthNames;
  }

  set monthShortNames(value) {
    this._monthShortNames = value;
  }

  get monthShortNames() {
    return this._monthShortNames;
  }

  set notInMothClassName(notInMothClassName) {
    this._notInMothClassName = notInMothClassName;
  }

  get notInMothClassName() {
    return this._notInMothClassName;
  }

  set todayClassName(todayClassName) {
    this._todayClassName = todayClassName;
  }

  get todayClassName() {
    return this._todayClassName;
  }

  set calendarDayClassName(value) {
    this._calendarDayClassName = value;
  }

  get calendarDayClassName() {
    return this._calendarDayClassName;
  }

  set dateFormat(value) {
    this._dateFormat = value;
  }

  get dateFormat() {
    return this._dateFormat;
  }

  set isDateAndTime(value) {
    this._isDateAndTime = value;
  }

  get isDateAndTime() {
    return this._isDateAndTime;
  }

  set dateSeparator(value) {
    this._dateSeparator = value;
  }

  get dateSeparator() {
    return this._dateSeparator;
  }

  get localeString() {
    return this._localeString;
  }

  set localeString(value) {
    this._localeString = value;
  }
}

//#region Constants
const _cal_init = Symbol("cal_init");

//#endregion Constants

/**
 * @class M2MJS_Component extends M2MJS_Component class 
 * and overrides 'getValue' and 'setValue' methods
 * 
*/
class Calendar extends M2MJS_Component {
  /**
   * @constructor
   * @param {String} id the binding object property
   * @param {HTMLElement} valueElement the place holder of calendar value. e.g. <text type="inbox" />
   * @param {HTMLElement} eventElement the HTML element which triggers, calendar show up and calendar hidding
   * @param {CalendarParameters} calendarParameters Various parameters helping parameteruzation of calendar UI
   */
  constructor(id, valueElement, eventElement, calendarParameters) {
    super(id, valueElement);


    /** @public */ this.onValueSet = (value) => { };

    // =================================================================================================== //

    //#region Calendar Day
    /* 
    ------------------
    -- Calendar Day --
    ------------------  
    */

    /** 
     * Inner Class for holding day number and type of day (e.g. Today, Current day [day if this._date] etc.)
     * */
    this.CalendarDay = class {
      constructor(day, type = null, week = 0) {

        /** Day types enumeration */
        this._types = Object.freeze({
          NOT_IN_MONTH: "NOT_IN_MONTH",
          PREVIOUS_MONTH: "PREVIOUS_MONTH",
          NEXT_MONTH: "NEXT_MONTH",
          TODAY: "TODAY",
          REGULAR: "REGULAR",
          DISABLED: "DISABLED",
          CURRENT_DAY: "CURRENT_DAY",
        });

        this._weeks = Object.freeze({
          WEEK1: 1,
          WEEK2: 2,
          WEEK3: 3,
          WEEK4: 4,
          WEEK5: 5,
          WEEK6: 6
        });
        /* Day number */
        this._day = day;

        /* Day type */
        this._type = type;

        this._week = week;
      }

      get day() {
        return this._day;
      }

      set day(value) {
        this._day = value;
      }

      get type() {
        return this._type;
      }

      set type(value) {
        this._type = value;
      }

      get types() {
        return this._types;
      }

      set week(value) {
        this._week = value;
      }

      get week() {
        return this._week;
      }

      get weeks() {
        return this._weeks;
      }
    };

    /* 
    --------------------
    -- / Calendar Day --
    --------------------
    */

    //#endregion Calendar Day

    // =================================================================================================== //

    //#region Calendar State
    /*
     --------------------
     -- Calendar State --
     --------------------
    */
    /**
     * Calendar states
     */

    this.CalendarState = class extends M2MJS_Observable {
      constructor(state = null) {
        super();
        this._states = Object.freeze({
          MONTH_STATE: "MONTH_STATE",
          MONTHS_OF_A_YEAR_STATE: "MONTHS_OF_A_YEAR_STATE",
          YEARS_OF_A_DECADE: "YEARS_OF_A_DECADE",
          TIME_STATE: "TIME_STATE"
        });

        this._initialState = Object.freeze(this._states.MONTH_STATE);

        this._state = (state === null ? this._initialState : state);
      }

      async initState() {
        return new Promise((resolve, reject) => {
          this._state = this._initialState;
          this.notifyObservers(this._state);

          resolve(true);
        });
      }

      async setNextState() {
        return new Promise((resolve, reject) => {
          switch (this._state) {
            case this._states.MONTH_STATE:
              this._state = this._states.MONTHS_OF_A_YEAR_STATE;
              this.notifyObservers(this._state);
              break;

            case this._states.MONTHS_OF_A_YEAR_STATE:
              this._state = this._states.YEARS_OF_A_DECADE;
              this.notifyObservers(this._state);
              break;

            case this._states.TIME_STATE: this._state = this._initialState;
              this.notifyObservers(this._state);
              break;
          }

          resolve(true);
        });
      }

      async setPreviousState() {
        return new Promise((resolve, reject) => {
          switch (this._state) {
            case this._states.MONTH_STATE:
              this.notifyObservers(this._state);
              break;

            case this._states.MONTHS_OF_A_YEAR_STATE:
              this._state = this._states.MONTH_STATE;
              this.notifyObservers(this._state);
              break;

            case this._states.YEARS_OF_A_DECADE:
              this._state = this._states.MONTHS_OF_A_YEAR_STATE;
              this.notifyObservers(this._state);
              break;

            case this._states.TIME_STATE: this._state = this._initialState;
              this.notifyObservers(this._state);
              break;
          }

          resolve(true);
        });
      }

      async setState(value) {
        return new Promise((resolve, reject) => {
          this._state = value;
          this.notifyObservers(this._state);
          resolve(true);
        });
      }

      get state() {
        return this._state;
      }

      get states() {
        return this._states;
      }

      get initialState() {
        return this._initialState;
      }
    };

    /*
     ----------------------
     -- / Calendar State --
     ----------------------
    */
    //#endregion Calendar State

    // =================================================================================================== //

    //#region CalendarTemplateRenderer

    this.CalendarTemplateRenderer = class extends M2MJS_Observer {
      constructor(templates) {
        super();

        this._calendarElement = null;
        this._templates = templates;

        this.update = (observable, state) => {
          this.onUpdateSate(observable, state);
        };
      }

      async onUpdateSate(observable, state) {
        let calendarElement = null;
        switch (state) {
          case observable.states.MONTH_STATE:
            calendarElement = this._templates.daysOfMonthTemplate;
            break;
          case observable.states.MONTHS_OF_A_YEAR_STATE:
            calendarElement = this._templates.monthsOfAYearTemplate;
            break;
          case observable.states.YEARS_OF_A_DECADE:
            calendarElement = this._templates.yearsOfADecadeTemplate;
            break;
          case observable.states.TIME_STATE:
            calendarElement = this._templates.chooseTimeTemplate;
            break;
        }

        if (this._calendarElement === null) {
          document.body.appendChild(calendarElement);
        } else {
          document.body.replaceChild(calendarElement, this._calendarElement);
        }

        M2MJS_XBrowser.addHandler(calendarElement, "click", async (e) => {
          M2MJS_XBrowser.stopEventPropagation(e);
        });

        this._calendarElement = calendarElement;
      }

      get calendarElement() {
        return this._calendarElement;
      }

      get templates() {
        return this._templates;
      }
    };
    //#endregion CalendarTemplateRenderer

    // =================================================================================================== //

    //#region CalendarVisibilyState
    this.CalendarVisibilyState = class extends M2MJS_Observable {
      constructor(state = null) {
        super();

        this._states = Object.freeze({
          VISIBLE: "VISIBLE",
          NOT_VISIBLE: "NOT_VISIBLE"
        });

        this._state = (state === null ? this._states.NOT_VISIBLE : state);

        this._event = null;
      }

      async setVisible(e) {
        this._state = this._states.VISIBLE;
        this._event = e;
        this.notifyObservers(this._state);
      }

      async setNotVisible() {
        this._state = this._states.NOT_VISIBLE;
        this.notifyObservers(this._state);
      }

      async setNextState(e) {
        if (this._state === this._states.VISIBLE) {
          this._state = this._states.NOT_VISIBLE;
        } else {
          this._state = this._states.VISIBLE;
        }

        this._event = e;

        this.notifyObservers(this._state);
      }

      get state() {
        return this._state;
      }

      get states() {
        return this._states;
      }

      get event() {
        return this._event;
      }
    };

    //#endregion CalendarVisibilyState

    // =================================================================================================== //

    //#region  CalendarVisibilityObserver
    this.CalendarVisibilityObserver = class extends M2MJS_Observer {
      constructor(templateRenderer) {
        super();

        this.top = null;
        this.left = null;
        this._templateRenderer = templateRenderer;

        this.update = (observable, state) => {
          this.onUpdateSate(observable, state);
        };
      }

      async onUpdateSate(observable, state) {
        switch (state) {
          case observable.states.VISIBLE:
            M2MJS_XBrowser.stopEventPropagation(observable.event);

            this._templateRenderer.calendarElement.style.display = '';

            if (this.top === null) {
              this.top = M2MJS_XBrowser.eventClientY(observable.event) + 10;
            }

            if (this.left === null) {
              this.left = M2MJS_XBrowser.eventClientX(observable.event) + 10;
            }

            this._templateRenderer.calendarElement.style.top = `${this.top}px`;
            this._templateRenderer.calendarElement.style.left = `${this.left}px`;
            break;
          case observable.states.NOT_VISIBLE:
            if (this._templateRenderer.calendarElement) {
              this._templateRenderer.calendarElement.style.display = 'none';

              this.top = null;
              this.left = null;
            }
            break;
        }
      }
    };
    //#endregion CalendarVisibilityObserver

    // =================================================================================================== //

    //#region CalendarDataRenderer

    this.CalendarDataRenderer = class extends M2MJS_Observer {
      constructor(templateRenderer, calendar, date = null) {
        super();

        this._templateRenderer = templateRenderer;
        this._calendar = calendar;
        this._date = (date === null ? new Date() : date);
        this._showDate = this._date;

        this.update = async (observable, data) => {
          if (observable.id === "CalendarValue") {
            this._date = M2MJS_DateWithArithmetic.cloneDate(data);
            this.showDate = M2MJS_DateWithArithmetic.cloneDate(data);
          } else {
            // console.info("Paint calendar");
            await this.onUpdateSate(observable, data);
          }
        };

        this.onSelectDate = (date) => { };
        this.onSelectMonth = (month, year) => { };
        this.onSelectYear = (year) => { };
        this.onSelectTime = (hour, minute) => { };
        this.onCancelTime = () => { };


        //#region  Months Component
        this.MonthsComponent = class extends M2MJS_Component {
          constructor(id, element, data) {
            super(id, element);
            this.form = new M2MJS_Form();
            this.month = -1;

            this.onSelect = () => { };

            this.init(data);
          }

          init(data) {
            // console.info("init");
            this.form.addComponent(new M2MJS_Component("month1", this.element.querySelector("#month1")));
            this.form.addComponent(new M2MJS_Component("month2", this.element.querySelector("#month2")));
            this.form.addComponent(new M2MJS_Component("month3", this.element.querySelector("#month3")));
            this.form.addComponent(new M2MJS_Component("month4", this.element.querySelector("#month4")));
            this.form.addComponent(new M2MJS_Component("month5", this.element.querySelector("#month5")));
            this.form.addComponent(new M2MJS_Component("month6", this.element.querySelector("#month6")));
            this.form.addComponent(new M2MJS_Component("month7", this.element.querySelector("#month7")));
            this.form.addComponent(new M2MJS_Component("month8", this.element.querySelector("#month8")));
            this.form.addComponent(new M2MJS_Component("month9", this.element.querySelector("#month9")));
            this.form.addComponent(new M2MJS_Component("month10", this.element.querySelector("#month10")));
            this.form.addComponent(new M2MJS_Component("month11", this.element.querySelector("#month11")));
            this.form.addComponent(new M2MJS_Component("month12", this.element.querySelector("#month12")));

            this.form.modelObject = data;

            for (let month = 1; month <= 12; month++) {

              M2MJS_XBrowser.addHandler(this.element.querySelector(`#month${month}`), "click", (e) => {
                // console.info("click on ", `month${month}`);
                this.month = month;
                this.onSelect();
              });
            }
          }

          setValue(value) {
            this.month = value;
          }

          getValue() {
            return this.month;
          }

        };

        this.monthsComponent = null;
        this.monthsForm = null;
        //#endregion Months Component

        //#region Years Component
        this.YearsComponent = class extends M2MJS_Component {
          constructor(id, element, decadeYears) {
            super(id, element);

            //this.form = new M2MJS_Form();
            this.year = -1;

            this.onSelect = () => { };

            this.initEvents(decadeYears);
            this.renderYears(decadeYears);
          }

          initEvents(decadeYears) {
            decadeYears.forEach((year, index) => {
              M2MJS_XBrowser.addHandler(this.element.querySelector(`#year${index + 1}`), "click", async (e) => {
                this.year = this.element.querySelector(`#year${index + 1}`).innerHTML;
                //console.info("year=", this.year);
                this.onSelect();
              });
            });
          }

          renderYears(decadeYears) {
            // console.info("element = ", this.element);

            decadeYears.forEach((year, index) => {
              this.element.querySelector(`#year${index + 1}`).innerHTML = year;
            });
          }

          set decadeYears(value) {
            this.renderYears(value);
          }

          getValue() {
            // console.info("getValue::year=", this.year);
            return this.year;
          }

          setValue(value) {
            this.year = value;
          }
        };

        this.yearsComponent = null;
        this.yearsForm = null;

        //#endregion Years Component

        //#region Time Component
        this.TimeComponent = class extends M2MJS_Component {
          constructor(id, element, time) {
            super(id, element);
            this._time = time;

            this.onSelect = (time) => { };
            this.onCancel = () => { };
            this.initEvents();
            this.renderTime();
          }

          initEvents() {
            /*Plus One hour */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_time_hours_plus"), "click", async (e) => {
              this._time.h++;
              if (this._time.h === 24) {
                this._time.h = 0;
              }

              this.renderTimeHours();
            });

            /*Plus one minute */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_time_minutes_plus"), "click", async (e) => {
              this._time.m++;
              if (this._time.m === 60) {
                this._time.m = 0;
              }

              this.renderTimeMinutes();
            });

            /*Minus one hour */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_time_hours_minus"), "click", async (e) => {
              this._time.h--;
              if (this._time.h === -1) {
                this._time.h = 23;
              }

              this.renderTimeHours();
            });

            /* Minus one minute */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_time_minutes_minus"), "click", async (e) => {
              this._time.m--;
              if (this._time.m === -1) {
                this._time.m = 59;
              }

              this.renderTimeMinutes();
            });

            /* Plus five minutes */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_time_minutes_plus_five"), "click", async (e) => {
              this._time.m += 5;
              if (this._time.m >= 59) {
                this._time.m = this._time.m - 60;
              }

              this.renderTimeMinutes();
            });

            /* Minus five minutes */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_time_minutes_minus_five"), "click", async (e) => {
              this._time.m -= 5;
              if (this._time.m < 0) {
                this._time.m = this._time.m + 60;
              }

              this.renderTimeMinutes();
            });

            /* Plus / Minus 12 hours */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_time_12_hours_plus_minus"), "click", async (e) => {
              this._time.h += 12;
              if (this._time.h > 24) {
                this._time.h -= 24;
              }

              if (this._time.h === 24) {
                this._time.h = 0;
              }

              this.renderTimeHours();
            });

            /* Select Time */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#cal_select_time"), "click", async (e) => {
              this.onSelect(this._time);
            });

            /* Cancel Time Form */
            M2MJS_XBrowser.addHandler(this.element.querySelector("#selectedDateTime"), "click", async (e) => {
              this.onCancel();
            });
          }

          renderTime() {
            this.renderTimeHours();
            this.renderTimeMinutes();
          }

          renderTimeHours() {
            this.element.querySelector("#cal_time_hours").innerHTML = this._time.h > 9 ? `${this._time.h}` : `0${this._time.h}`;
          }

          renderTimeMinutes() {
            this.element.querySelector("#cal_time_minutes").innerHTML = this._time.m > 9 ? `${this._time.m}` : `0${this._time.m}`;
          }

          set time(value) {
            this._time = value;
            this.renderTime(this._time);
          }

          setValue(value) {
            this._time = value;
          }

          get value() {
            return this._time;
          }

        };
        this.timeComponent = null;
        //this.timeForm = null;
        //#endregion Time Component

      }

      async onUpdateSate(observable, state) {
        switch (state) {
          case observable.states.MONTH_STATE:
            await this.renderDaysForm();
            break;
          case observable.states.MONTHS_OF_A_YEAR_STATE:
            await this.renderMonthsForm();
            break;
          case observable.states.YEARS_OF_A_DECADE:
            await this.renderDecadeForm();
            break;
          case observable.states.TIME_STATE:
            await this.renderTimeForm();
            break;
        }
      }

      //#region Days Form
      async renderDaysForm() {
        await this.renderWeekDays();
        await this.renderDaysOfMonth(this._showDate);
        await this.renderTimeOfDate();

      }

      async renderWeekDays() {
        const weekDayNamesTemplate = await M2MJS_TemplateLoader.loadTemplateFromCurrentPage("weekDayNamesTemplate");

        return new Promise((resolve, reject) => {
          const dayNamesGrid = new M2MJS_Grid(
            this._calendar.calendarParameters.weekDays,
            this._templateRenderer.calendarElement.querySelector("#weekDayNamesPlaceHolder"),
            weekDayNamesTemplate
          );

          dayNamesGrid.renderers = [{
            name: "weekDay",
            code: async (element, objectValue, gr) => {
              element.innerHTML = objectValue;
            },
          },];

          dayNamesGrid.renderGrid();

          resolve(true);
        });
      }

      async renderDaysOfMonth(calendarDate) {
        return new Promise(async (resolve, reject) => {
          this._showDate = this.cloneDate(calendarDate);

          /* Render Month */
          this._templateRenderer.calendarElement.querySelector("#selectedMonth").innerHTML =
            `${this._calendar.calendarParameters.monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;

          /* Render Days */
          const calendarData = await this.defineMonthCalendarData(calendarDate);
          const daysTemplate = await M2MJS_TemplateLoader.loadTemplateFromCurrentPage("daysTemplate");

          //#region render grid

          const daysGrid = new M2MJS_Grid(
            calendarData,
            this._templateRenderer.calendarElement.querySelector("#daysPlaceHolder"),
            daysTemplate
          );

          daysGrid.renderers = [{
            name: "day1",
            code: async (element, objectValue, gr) => {
              await this.renderCalendarDay(element, objectValue[0]);
            }
          },
          {
            name: "day2",
            code: async (element, objectValue, gr) => {
              await this.renderCalendarDay(element, objectValue[1]);
            }
          },
          {
            name: "day3",
            code: async (element, objectValue, gr) => {
              await this.renderCalendarDay(element, objectValue[2]);
            }
          },
          {
            name: "day4",
            code: async (element, objectValue, gr) => {
              await this.renderCalendarDay(element, objectValue[3]);
            }
          },
          {
            name: "day5",
            code: async (element, objectValue, gr) => {
              await this.renderCalendarDay(element, objectValue[4]);
            }
          },
          {
            name: "day6",
            code: async (element, objectValue, gr) => {
              await this.renderCalendarDay(element, objectValue[5]);
            }
          },
          {
            name: "day7",
            code: async (element, objectValue, gr) => {
              await this.renderCalendarDay(element, objectValue[6]);
            }
          }
          ];

          daysGrid.renderGrid();
          //#endregion render grid

          resolve(true);
        });
      }

      /*TODO: Switch to private */
      async renderCalendarDay(element, calendarDay) {
        element.innerHTML = calendarDay.day;

        switch (calendarDay.type) {
          case calendarDay.types.TODAY:
            element.className = this._calendar.calendarParameters.todayClassName;
            break;
          case calendarDay.types.CURRENT_DAY:
            element.className = this._calendar.calendarParameters.calendarDayClassName;
            break;
          case calendarDay.types.NOT_IN_MONTH:
          case calendarDay.types.PREVIOUS_MONTH:
          case calendarDay.types.NEXT_MONTH:
            element.className = this._calendar._calendarParameters.notInMothClassName;
            break;
        }

        M2MJS_XBrowser.addHandler(element, "click", async (e) => {
          await this.onSelectDate(calendarDay);
        });
      }

      /*TODO: Switch to private */
      async defineMonthCalendarData(calendarDate) {
        return new Promise((resolve, reject) => {
          const today = new Date();

          let caledarDateWithArithmeticOfCurrentMonth = new M2MJS_DateWithArithmetic(this.cloneDate(calendarDate));

          caledarDateWithArithmeticOfCurrentMonth.setDate(1);
          while (caledarDateWithArithmeticOfCurrentMonth.getDay() > 0) {
            caledarDateWithArithmeticOfCurrentMonth.addDay(-1);
          }

          let calendarMonthDays = [];
          for (let week = 1; week <= 6; week++) {
            for (let day = 1; day <= 7; day++) {
              let caledarDay = new this._calendar.CalendarDay(caledarDateWithArithmeticOfCurrentMonth.getDate());
              caledarDay.type = (() => {
                if (caledarDateWithArithmeticOfCurrentMonth.toDate().getFullYear() < calendarDate.getFullYear()) {
                  return caledarDay.types.PREVIOUS_MONTH;
                }

                if (caledarDateWithArithmeticOfCurrentMonth.toDate().getMonth() < calendarDate.getMonth()) {
                  return caledarDay.types.PREVIOUS_MONTH;
                }

                if (caledarDateWithArithmeticOfCurrentMonth.toDate().getFullYear() > calendarDate.getFullYear()) {
                  return caledarDay.types.NEXT_MONTH;
                }

                if (caledarDateWithArithmeticOfCurrentMonth.toDate().getMonth() > calendarDate.getMonth()) {
                  return caledarDay.types.NEXT_MONTH;
                }

                if (caledarDateWithArithmeticOfCurrentMonth.toDate().getFullYear() === today.getFullYear() &&
                  caledarDateWithArithmeticOfCurrentMonth.toDate().getMonth() === today.getMonth() &&
                  caledarDateWithArithmeticOfCurrentMonth.toDate().getDate() === today.getDate()) {
                  return caledarDay.types.TODAY;
                }

                if (caledarDateWithArithmeticOfCurrentMonth.toDate().getFullYear() === this._date.getFullYear() &&
                  caledarDateWithArithmeticOfCurrentMonth.toDate().getMonth() === this._date.getMonth() &&
                  caledarDateWithArithmeticOfCurrentMonth.toDate().getDate() === this._date.getDate()) {
                  return caledarDay.types.CURRENT_DAY;
                }

                return caledarDay.types.REGULAR;
              })();

              caledarDay.week = week;

              calendarMonthDays.push(caledarDay);
              caledarDateWithArithmeticOfCurrentMonth.addDay(1);
            }
          }

          let w1 = [];
          let w2 = [];
          let w3 = [];
          let w4 = [];
          let w5 = [];
          let w6 = [];

          let week = 0;
          calendarMonthDays.forEach((day, index) => {
            if (index % 7 === 0) {
              week = ((index / 7) + 1);
            }

            /* Just for fun. For old times' sake. */
            //eval(`calendarData.w${week}.push(day);`);

            switch (week) {
              case 1:
                w1.push(day);
                break;
              case 2:
                w2.push(day);
                break;
              case 3:
                w3.push(day);
                break;
              case 4:
                w4.push(day);
                break;
              case 5:
                w5.push(day);
                break;
              case 6:
                w6.push(day);
                break;
            }
          });

          let calendarData = [];

          calendarData.push(w1);
          calendarData.push(w2);
          calendarData.push(w3);
          calendarData.push(w4);
          calendarData.push(w5);
          calendarData.push(w6);

          resolve(calendarData);
        });
      }

      async renderTimeOfDate() {
        if (this._calendar.calendarParameters.isDateAndTime) {
          this._templateRenderer.calendarElement.querySelector("#timePlaceHolder").style.visibility = 'visible';
          this._templateRenderer.calendarElement.querySelector("#cal_time").innerHTML =
            new M2MJS_DateWithArithmetic(this.showDate, this._calendar.calendarParameters.dateFormat).timeString();
        } else {
          this._templateRenderer.calendarElement.querySelector("#timePlaceHolder").style.visibility = 'hidden';
        }
      }
      //#endregion  Days Form

      //#region Months Form
      async renderMonthsForm() {
        const data = {
          year: this._showDate.getFullYear(),
          month: -1
        };

        if (this.monthsForm === null) {
          this.monthsForm = new M2MJS_Form();
          this.monthsForm.addComponent(new SimpleComponent("year", this._templateRenderer.calendarElement.querySelector("#selectedYear")));
        }

        if (this.monthsComponent === null) {
          const monthsData = {
            month1: this._calendar.calendarParameters.monthNames[0],
            month2: this._calendar.calendarParameters.monthNames[1],
            month3: this._calendar.calendarParameters.monthNames[2],
            month4: this._calendar.calendarParameters.monthNames[3],
            month5: this._calendar.calendarParameters.monthNames[4],
            month6: this._calendar.calendarParameters.monthNames[5],
            month7: this._calendar.calendarParameters.monthNames[6],
            month8: this._calendar.calendarParameters.monthNames[7],
            month9: this._calendar.calendarParameters.monthNames[8],
            month10: this._calendar.calendarParameters.monthNames[9],
            month11: this._calendar.calendarParameters.monthNames[10],
            month12: this._calendar.calendarParameters.monthNames[11]
          };

          this.monthsComponent = new this.MonthsComponent("month", this._templateRenderer.calendarElement, monthsData);

          this.monthsComponent.onSelect = () => {
            this.onSelectMonth(this.monthsForm.modelObject.month, this.monthsForm.modelObject.year);
          };

          this.monthsForm.addComponent(this.monthsComponent);
        }

        this.monthsForm.modelObject = data;
      }
      //#endregion Months Form

      //#region Decade Form
      async renderDecadeForm() {
        const referenceYear = this._showDate.getFullYear();
        const decadeStart = this.defineDecadeStart(referenceYear);
        const decadeEnd = this.defineDecadeEnd(decadeStart);

        const data = {
          decade: `${decadeStart} - ${decadeEnd}`,
          year: -1
        };

        if (this.yearsForm === null) {
          this.yearsForm = new M2MJS_Form();
          this.yearsForm.addComponent(new SimpleComponent("decade", this._templateRenderer.calendarElement.querySelector("#selectedDecade")));
        }

        const decadeYears = this.defineYearsOfADecade(decadeStart, 2);

        if (this.yearsComponent === null) {
          this.yearsComponent = new this.YearsComponent("year", this._templateRenderer.calendarElement, decadeYears);
          this.yearsForm.addComponent(this.yearsComponent);

          this.yearsComponent.onSelect = () => {
            this.onSelectYear(this.yearsForm.modelObject.year);
          };
        } else {
          this.yearsComponent.decadeYears = decadeYears;
        }

        this.yearsForm.modelObject = data;
      }

      defineDecadeStart(referenceYear) {
        let millenium = referenceYear % (referenceYear >= 100 ? 100 : (referenceYear >= 10 ? 10 : 1));
        millenium = referenceYear - millenium;
        if (millenium < 10) {
          millenium = 0;
        }

        let decadeYear = millenium > 0 ? referenceYear % millenium : 0;
        let restYear = decadeYear % 10;
        let decadeStart = decadeYear - restYear;
        decadeStart += millenium;

        return decadeStart;
      }

      defineDecadeEnd(decadeStart) {
        return decadeStart + 9;
      }

      defineYearsOfADecade(decadeStart, extraYears) {
        let yearsOfADecade = [];
        for (let year = decadeStart; year <= decadeStart + 9 + extraYears; year++) {
          yearsOfADecade.push(year);
        }

        return yearsOfADecade;
      }
      //#endregion Decade Form

      //#region Time Form
      async renderTimeForm() {
        const data = {
          time: {
            h: this._showDate.getHours(),
            m: this._showDate.getMinutes()
          }
        };
        if (this.timeComponent === null) {
          this.timeComponent = new this.TimeComponent("time", this._templateRenderer.calendarElement, data.time);

          this.timeComponent.onSelect = (time) => {
            this.onSelectTime(time.h, time.m);
          };

          this.timeComponent.onCancel = () => {
            this.onCancelTime();
          };
        } else {
          this.timeComponent.time = data.time;
        }

        this._templateRenderer.calendarElement.querySelector("#selectedDateTime").innerHTML = new M2MJS_DateWithArithmetic(this._showDate).toString(this._calendar.calendarParameters.dateFormat);
      }
      //#endregion Time Form

      cloneDate(date) {
        if (date == null) {
          return null;
        }

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
      }

      get date() {
        return this._date;
      }

      set date(value) {
        this._date = value;
      }

      get showDate() {
        return this._showDate;
      }

      set showDate(value) {
        this._showDate = value;
      }
    };

    //#endregion CalendarDataRenderer

    // =================================================================================================== //

    //#region Calendar Value Observer

    this.CalendarValueObserver = class extends M2MJS_Observer {
      constructor(calendar) {
        this._calendar = calendar;

        this.update = (observable, value) => {
          this.onUpdateValue(observable, value);
        };
      }

      async onUpdateValue(observable, value) {
        this._calendar.setValue(value);
      }
    };

    //#endregion Calendar Value Observer

    // =================================================================================================== //

    //#region Calendar Value Observable

    this.CalendarValue = class extends M2MJS_Observable {
      constructor(calendar) {
        super("CalendarValue");
        this._calendar = calendar;
      }

      setValue(value) {
        this.notifyObservers(value);
      }
    };

    //#endregion Calendar Value Observer

    // =================================================================================================== //    

    //#region Private Members
    this._calendarParameters = calendarParameters;
    this._date = new Date();
    this._timeOptions = { hc: 'h24', hour12: false, hour: '2-digit', minute: '2-digit' };

    this.calendarValue = new this.CalendarValue(this);
    this.calendarState = new this.CalendarState();
    this.calendarVisibilyState = new this.CalendarVisibilyState();
    //#endregion Private Members

    /* Init */
    this[_cal_init](eventElement);
  }
  //#region Private Methods

  /*
   -------------
   -- Private --
   -------------
  */

  /**
   * Initiates events and values related to UI
   */
  [_cal_init](eventElement) {

    // -------------------------- Async code ----------------------------------------  //
    // #region Async code (events and other)
    (async () => {
      const daysOfMonthTemplate = await M2MJS_TemplateLoader.loadTemplateFromCurrentPage("daysOfMonthTemplate");
      const monthsOfAYearTemplate = await M2MJS_TemplateLoader.loadTemplateFromCurrentPage("monthsOfAYearTemplate");
      const yearsOfADecadeTemplate = await M2MJS_TemplateLoader.loadTemplateFromCurrentPage("yearsOfADecadeTemplate");
      const chooseTimeTemplate = await M2MJS_TemplateLoader.loadTemplateFromCurrentPage("chooseTimeTemplate");

      let templateRenderer = new this.CalendarTemplateRenderer({
        "daysOfMonthTemplate": daysOfMonthTemplate,
        "monthsOfAYearTemplate": monthsOfAYearTemplate,
        "yearsOfADecadeTemplate": yearsOfADecadeTemplate,
        "chooseTimeTemplate": chooseTimeTemplate
      });

      M2MJS_XBrowser.addHandler(eventElement, "click", async (e) => {
        if (this.calendarVisibilyState.state === this.calendarVisibilyState.states.NOT_VISIBLE) {
          await this.calendarState.initState();
        }

        await this.calendarVisibilyState.setNextState(e);
      });

      M2MJS_XBrowser.addHandler(document.body, "click", async (e) => {
        await this.calendarVisibilyState.setNotVisible();
      });

      M2MJS_XBrowser.addHandler(this.element, "click", async (e) => {
        M2MJS_XBrowser.stopEventPropagation(e);
      });

      M2MJS_XBrowser.addHandler(this.element, "keyup", async (e) => {
        this.setValue(this.element.value);
      });

      this.calendarState.addObserver(templateRenderer);

      let calendarVisibilityObserver = new this.CalendarVisibilityObserver(templateRenderer);
      this.calendarVisibilyState.addObserver(calendarVisibilityObserver);

      let dataRenderer = new this.CalendarDataRenderer(templateRenderer, this, this._date);
      this.calendarState.addObserver(dataRenderer);

      M2MJS_XBrowser.addHandler(daysOfMonthTemplate.querySelector("#previousMonth"), "click", async (e) => {
        dataRenderer.renderDaysOfMonth(new M2MJS_DateWithArithmetic(dataRenderer.showDate).addMonth(-1).toDate());
      });

      M2MJS_XBrowser.addHandler(daysOfMonthTemplate.querySelector("#nextMonth"), "click", async (e) => {
        dataRenderer.renderDaysOfMonth(new M2MJS_DateWithArithmetic(dataRenderer.showDate).addMonth(1).toDate());
      });

      M2MJS_XBrowser.addHandler(daysOfMonthTemplate.querySelector("#today"), "click", async (e) => {
        dataRenderer.renderDaysOfMonth(new Date());
      });

      M2MJS_XBrowser.addHandler(daysOfMonthTemplate.querySelector("#cal_btn_time"), "click", async (e) => {
        M2MJS_XBrowser.stopEventPropagation(e);

        await this.calendarState.setState(this.calendarState.states.TIME_STATE);
        await this.calendarVisibilyState.setVisible(e);
      });

      M2MJS_XBrowser.addHandler(daysOfMonthTemplate.querySelector("#selectedMonth"), "click", async (e) => {
        M2MJS_XBrowser.stopEventPropagation(e);

        await this.calendarState.setNextState();
        await this.calendarVisibilyState.setVisible(e);
      });

      M2MJS_XBrowser.addHandler(monthsOfAYearTemplate.querySelector("#selectedYear"), "click", async (e) => {
        M2MJS_XBrowser.stopEventPropagation(e);

        await this.calendarState.setNextState();
        await this.calendarVisibilyState.setVisible(e);
      });

      dataRenderer.onSelectDate = async (calendarDay) => {
        dataRenderer.showDate.setDate(calendarDay.day);

        if (calendarDay.type === calendarDay.types.NEXT_MONTH) {
          dataRenderer.showDate.setMonth(dataRenderer.showDate.getMonth() + 1);
        }

        if (calendarDay.type === calendarDay.types.PREVIOUS_MONTH) {
          dataRenderer.showDate.setMonth(dataRenderer.showDate.getMonth() - 1);
        }

        dataRenderer.date = dataRenderer.cloneDate(dataRenderer.showDate);
        this._date = dataRenderer.cloneDate(dataRenderer.date);

        //this.setValue(this._date.toLocaleDateString("el-GR"));
        if (this._calendarParameters.isDateAndTime) {
          const options = { hc: 'h24', hour12: false, hour: '2-digit', minute: '2-digit' };
          this.setValue(this._date.toLocaleDateString(this._calendarParameters.localeString, options));
        } else {
          this.setValue(this._date.toLocaleDateString(this._calendarParameters.localeString));
        }

        await this.calendarVisibilyState.setNotVisible();
      };

      dataRenderer.onSelectMonth = async (month, year) => {
        dataRenderer.showDate = M2MJS_DateWithArithmetic.createDate(1, month, year);
        await this.calendarState.setPreviousState();
      };

      dataRenderer.onSelectYear = async (year) => {
        dataRenderer.showDate.setFullYear(year);
        await this.calendarState.setPreviousState();
      };

      dataRenderer.onSelectTime = async (hour, minute) => {
        dataRenderer.showDate.setHours(hour, minute);

        await this.calendarState.setPreviousState();
      };

      dataRenderer.onCancelTime = async () => {
        await this.calendarState.setPreviousState();
      }

      M2MJS_XBrowser.addHandler(monthsOfAYearTemplate.querySelector("#previousYear"), "click", async (e) => {
        dataRenderer.showDate.setFullYear(dataRenderer.showDate.getFullYear() - 1);
        dataRenderer.renderMonthsOfAYear();
      });

      M2MJS_XBrowser.addHandler(monthsOfAYearTemplate.querySelector("#nextYear"), "click", async (e) => {
        dataRenderer.showDate.setFullYear(dataRenderer.showDate.getFullYear() + 1);
        dataRenderer.renderMonthsOfAYear();
      });

      M2MJS_XBrowser.addHandler(monthsOfAYearTemplate.querySelector("#today"), "click", async (e) => {
        await this.calendarState.setPreviousState();
        dataRenderer.renderDaysOfMonth(new Date());
      });

      M2MJS_XBrowser.addHandler(yearsOfADecadeTemplate.querySelector("#previousDecade"), "click", async (e) => {
        dataRenderer.showDate.setFullYear(dataRenderer.showDate.getFullYear() - 10);
        dataRenderer.renderYearsOfADecade();
      });

      M2MJS_XBrowser.addHandler(yearsOfADecadeTemplate.querySelector("#nextDecade"), "click", async (e) => {
        dataRenderer.showDate.setFullYear(dataRenderer.showDate.getFullYear() + 10);
        dataRenderer.renderYearsOfADecade();
      });

      M2MJS_XBrowser.addHandler(yearsOfADecadeTemplate.querySelector("#today"), "click", async (e) => {
        await this.calendarState.setPreviousState();
        await this.calendarState.setPreviousState();
        dataRenderer.renderDaysOfMonth(new Date());
      });

      this.calendarValue.addObserver(dataRenderer);

    })();

    // ------------------------ / Async code ----------------------------------------  //

    // #endregion Async code (events and other)

  }

  /*
    ---------------
    -- / Private --
    ---------------
  */

  //#endregion Private Methods

  //#region Public Members

  /* 
    ------------ 
    -- Public --
    ------------ 
   */

  /**
   * @override
   * @returns {String} Calendar's date as formated String value
   */
  getValue() {
    if (this._date === null) {
      return null;
    }

    const options = { hc: 'h24', hour12: false, hour: '2-digit', minute: '2-digit' };

    return this._date.toLocaleDateString(this._calendarParameters.localeString, options).replace(",", "");
  }

  /**
   * @override
   * Sets Calendar date and triggers onValueSet 'public event'
   * @param {String} value Calendar's date as formated String value
   */
  setValue(value) {
    let paintCalendar = true;

    if (value != null && value.trim() != '') {
      const currentDate = M2MJS_DateWithArithmetic.cloneDate(this._date);

      try {
        this._date = M2MJS_DateWithArithmetic.cloneDate(M2MJS_DateWithArithmetic.parseFromString(value, this._calendarParameters.dateFormat).toDate());

        if (M2MJS_DateWithArithmetic.equals(currentDate, this._date, this._calendarParameters.isDateAndTime)) {
          paintCalendar = false;
        }
      } catch (e) {
        this._date = (currentDate === null ? new Date() : currentDate);
        paintCalendar = false;
      }
    } else {
      this._date = new Date();
    }

    if (paintCalendar) {
      this.calendarValue.setValue(this._date);

      if (this.calendarVisibilyState.state === this.calendarVisibilyState.states.VISIBLE) {
        (async () => {
          await this.calendarState.initState();
        })();
      }
    }

    this.onValueSet(value);
  }

  /* 
    -------------- 
    -- / Public --
    -------------- 
  */

  //#endregion Public Members

  //#region Setters Getters

  /*
  -----------------------
  -- Setters / Getters --
  -----------------------
  */

  get calendarParameters() {
    return this._calendarParameters;
  }

  set calendarParameters(value) {
    this._calendarParameters = value;
  }

  /*
  -------------------------
  -- / Setters / Getters --
  -------------------------
  */

  //#endregion Setters Getters

  /*
  -------------------------
  -- / Setters / Getters --
  -------------------------
  */
}