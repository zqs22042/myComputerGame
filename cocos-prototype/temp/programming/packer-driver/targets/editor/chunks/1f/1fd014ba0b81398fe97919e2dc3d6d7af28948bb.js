System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, BossTimeline, _crd, PHASE_THRESHOLDS, TRANSITION_INVULNERABLE;

  function groupEventsByPhase(events, bossId) {
    const grouped = {
      1: [],
      2: [],
      3: []
    };

    for (const event of events) {
      if (event.boss_id !== bossId) continue;
      if (!grouped[event.phase]) grouped[event.phase] = [];
      grouped[event.phase].push(event);
    }

    for (const phase of [1, 2, 3]) {
      grouped[phase].sort((a, b) => a.event_time - b.event_time);
    }

    return grouped;
  }

  _export({
    groupEventsByPhase: groupEventsByPhase,
    BossTimeline: void 0
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e720a/Yk+JODLCKN2HN90FK", "BossTimeline", undefined);

      // Boss 时序调度器：与 tech-validation/src/bossTimeline.js 保持同一实现。
      _export("PHASE_THRESHOLDS", PHASE_THRESHOLDS = {
        2: 0.7,
        3: 0.35
      });

      _export("TRANSITION_INVULNERABLE", TRANSITION_INVULNERABLE = 1.5);

      _export("BossTimeline", BossTimeline = class BossTimeline {
        constructor({
          bossId,
          events,
          skills = [],
          onEvent
        }) {
          this.bossId = void 0;
          this.eventsByPhase = void 0;
          this.skills = void 0;
          this.onEvent = void 0;
          this.phase = 1;
          this.elapsed = 0;
          this.phaseTime = 0;
          this.hpRatio = 1;
          this.cursor = 0;
          this.invulnerableUntil = 0;
          this.cooldowns = {};
          this.phaseReached = [1];
          this.log = [];
          this.bossId = bossId;
          this.eventsByPhase = groupEventsByPhase(events, bossId);
          this.skills = new Map(skills.map(skill => [skill.skill_id, skill]));
          this.onEvent = onEvent != null ? onEvent : () => {};
        }

        isInvulnerable() {
          return this.elapsed < this.invulnerableUntil;
        }

        setHpRatio(ratio) {
          this.hpRatio = Math.max(0, Math.min(1, ratio));

          while (this.phase < 3 && this.hpRatio <= PHASE_THRESHOLDS[this.phase + 1]) {
            this.enterPhase(this.phase + 1);
          }
        }

        enterPhase(nextPhase) {
          this.phase = nextPhase;
          this.phaseTime = 0;
          this.cursor = 0;
          this.cooldowns = {};
          this.invulnerableUntil = this.elapsed + TRANSITION_INVULNERABLE;
          this.phaseReached.push(nextPhase);
        }

        update(dt) {
          this.elapsed += dt;
          this.phaseTime += dt;
          this.emitDueEvents();
        }

        emitDueEvents() {
          var _this$eventsByPhase$t;

          const list = (_this$eventsByPhase$t = this.eventsByPhase[this.phase]) != null ? _this$eventsByPhase$t : [];

          while (this.cursor < list.length && list[this.cursor].event_time <= this.phaseTime + 1e-9) {
            const event = list[this.cursor];
            this.cursor += 1;
            this.fire(event);
          }
        }

        fire(event) {
          const skill = event.skill_id ? this.skills.get(event.skill_id) : null;

          if (event.event_type === 'skill' && skill) {
            this.cooldowns[event.skill_id] = this.phaseTime + skill.cooldown;
          }

          if (event.event_type === 'transition' && event.warning > 0) {
            this.invulnerableUntil = Math.max(this.invulnerableUntil, this.elapsed + event.warning);
          }

          const entry = {
            time: Number(this.elapsed.toFixed(3)),
            phase: this.phase,
            eventType: event.event_type,
            skillId: event.skill_id,
            param: event.param,
            warning: event.warning,
            note: event.note
          };
          this.log.push(entry);
          this.onEvent(event, entry);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1fd014ba0b81398fe97919e2dc3d6d7af28948bb.js.map