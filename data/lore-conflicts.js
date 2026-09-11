// Phase 2–3 source audit only; unresolved source values are preserved.
export const loreConflicts = [
  {
    id: "nebla-six-regions-chronology",
    status: "TODO_LORE_CONFLICT",
    title: "네블라 6대 체계의 형성 시점 모호성",
    source: "대륙-에벨루아/세계관-차원 에벨루아 ㅡ 7개의 대륙.txt",
    values: [
      { line: 473, era: "침묵의 시대", text: "네블라에서는 죽은 왕국과 언데드 군세가 탄생하고, 끝없는 싸움 끝에 6대 어둠의 통치체제가 형성됨" },
      { line: 494, era: "재건의 시대", text: "네블라: 6대 어둠의 권역 형성" }
    ],
    note: "통치체제와 권역이 서로 다른 형성 단계를 뜻하는지는 원문에 명시되지 않음. 두 기록을 보존하며 성립·재편 등의 관계를 임의로 부여하지 않음.",
    resolution: null
  },
{
  "id": "latium-government-scope",
  "status": "TODO_LORE_CONFLICT",
  "title": "라티움 자유정부와 세비온 제국의 관계",
  "source": "대륙-에벨루아/세계관-차원 에벨루아 ㅡ 7개의 대륙.txt",
  "values": [
    {
      "lines": [
        94,
        96
      ],
      "text": "국가에 귀속되지 않은 자유대륙권 / 자유도시 연합과 중립 정부 / 중앙 자유정부"
    },
    {
      "lines": [
        1196,
        1203
      ],
      "text": "세비온 제국 / 라티움의 핵심 정치체제 / 황실·관료·마탑·상단연합·해군·정보길드의 실권 분점"
    }
  ],
  "note": "두 설명의 관계와 관할이 명확히 연결되지 않아, 양쪽을 출처별로 보존함. 어느 하나를 삭제하거나 새 제도 관계를 만들지 않음.",
  "resolution": null
},
{
  "id": "nebla-border-continents",
  "status": "TODO_LORE_CONFLICT",
  "title": "네블라 접경 대륙 수와 방어 체계의 범위",
  "source": "대륙-에벨루아/세계관-차원 에벨루아 ㅡ 7개의 대륙.txt",
  "values": [
    {
      "line": 127,
      "text": "네블라와 맞닿은 두 대륙은 협력하여 참호와 방벽, 감시 요새를 세워둠"
    },
    {
      "lines": [
        503,
        513
      ],
      "text": "세르반·자하르·라티움·엘루나 연합 및 세르반 연합 방어선, 자하르 통제선, 엘루나 감시 방벽, 라티움 해상 봉쇄선"
    }
  ],
  "note": "두 대륙의 범위와 이후 세 지상·한 해상 방어 체계의 관계가 명시되지 않음. 현재 지도 기준 목록과 개요 표현을 모두 보존.",
  "resolution": null
}

];
