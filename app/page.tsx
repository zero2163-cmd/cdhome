import Link from 'next/link'
import { connection } from 'next/server'
import { Suspense } from 'react'
import HeroCanvas from '@/components/HeroCanvas'
import PostRows from '@/components/PostRows'
import { formatDate } from '@/lib/format'
import { latestByCategory, listPosts } from '@/lib/posts'

export default function HomePage() {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-frame">
          <HeroCanvas />
          <div className="hero-in">
            <div className="hero-top">
              <span>Mobility Holding Company</span>
              <span className="loc">Seoul, Korea</span>
            </div>
            <div className="hero-mid">
              <h1>
                Building trust
                <br />
                into <span className="serif">every</span>
                <br />
                mobility deal.
              </h1>
              <div className="side">
                <p>
                  카동은 자동차 유통 플랫폼에 투자하고 함께 운영하는 모빌리티 지주회사입니다. 검증된 정보와 투명한
                  절차로 거래의 기준을 만듭니다.
                </p>
                <div className="cta">
                  <Link className="pill lux" href="/ir">
                    주주총회 · 공시 <span className="ar">→</span>
                  </Link>
                  <a className="tlink" href="#about">
                    회사소개
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-figs">
              <div>
                <b>230,000+</b>
                <span>누적 경매 건수</span>
              </div>
              <div>
                <b>8,000+</b>
                <span>누적 참여 딜러</span>
              </div>
              <div>
                <b>91%+</b>
                <span>채권 경매 실거래율</span>
              </div>
              <a href="#portfolio">
                Portfolio · 카옥션 <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="about">
        <div className="wrap">
          <div className="about-grid">
            <div>
              <span className="label">About us</span>
            </div>
            <div>
              <h2 className="statement">
                거래가 많은 시장보다,
                <br />
                <em>믿을 수 있는 시장</em>에 투자합니다.
              </h2>
              <div className="about-body">
                <p>
                  카동은 자동차 경매 플랫폼 카옥션의 모회사입니다. 검증된 정보와 투명한 절차가 자리 잡은 시장이 결국
                  더 큰 거래를 만든다고 믿습니다.
                </p>
                <p>
                  그룹의 전략, 재무, 거버넌스를 맡아 자회사가 본업에 집중하도록 돕고, 모빌리티 유통 밸류체인 안에서
                  다음 포트폴리오를 찾고 있습니다.
                </p>
              </div>
            </div>
          </div>
          <div className="values">
            <article className="value">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
                </svg>
              </div>
              <div>
                <h3>투명한 정보</h3>
                <p>차량 진단, 낙찰 이력, 정산 절차를 기록하고 공개합니다. 정보가 같아야 가격이 바로 섭니다.</p>
              </div>
            </article>
            <article className="value">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19h16M6 15l4-4 3 3 5-6" />
                  <path d="M15 8h3v3" />
                </svg>
              </div>
              <div>
                <h3>장기적 관점</h3>
                <p>분기 실적보다 거래 품질과 시장 점유를 봅니다. 자회사의 성장 주기에 맞춰 자본을 배분합니다.</p>
              </div>
            </article>
            <article className="value">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <circle cx="8" cy="9" r="3" />
                  <circle cx="16" cy="9" r="3" />
                  <path d="M3 20c.6-3 2.6-5 5-5s4.4 2 5 5M11 20c.6-3 2.6-5 5-5s4.4 2 5 5" />
                </svg>
              </div>
              <div>
                <h3>운영하는 투자</h3>
                <p>평가사 네트워크, 정산 시스템, 딜러 관리까지 운영 역량을 함께 쌓습니다.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Group structure</span>
              <h2>지배구조</h2>
            </div>
            <p>
              지주회사 카동 아래 자동차 경매 플랫폼 카옥션이 있습니다. 모빌리티 유통 밸류체인 안에서 다음 포트폴리오를
              검토하고 있습니다.
            </p>
          </div>
          <div className="struct">
            <div className="node hold">
              <div style={{ display: 'grid', gap: 8 }}>
                <small>Holding company</small>
                <h3>카동</h3>
              </div>
              <p>그룹 전략 · 재무 · 거버넌스 · 투자</p>
            </div>
            <div className="node">
              <small>Subsidiary</small>
              <h4>카옥션</h4>
              <p style={{ color: 'var(--muted)' }}>자동차 경매 플랫폼. 자산 · 채권 · 프로 · 셀프 경매 운영</p>
            </div>
            <div className="node next">
              <small>Pipeline</small>
              <h4>Next portfolio</h4>
              <p style={{ color: 'var(--muted)' }}>자동차 금융, 차량 진단, 물류 분야 검토 중</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="portfolio" style={{ background: 'var(--soft)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Portfolio</span>
              <h2>함께 키우는 회사</h2>
            </div>
            <p>카동이 투자하고 함께 운영하는 회사입니다.</p>
          </div>
          <div className="pf">
            <article className="pf-main">
              <div className="head">
                <h3>카옥션</h3>
                <span className="badge">Mobility marketplace · 자회사</span>
              </div>
              <p className="desc">
                검증된 정보와 투명한 절차로 안전하고 효율적인 차량 거래 환경을 제공하는 자동차 경매 플랫폼입니다.
              </p>
              <div className="chips">
                <div>
                  <b>자산 경매</b>
                  <span>안정적인 차량 거래</span>
                </div>
                <div>
                  <b>채권 경매</b>
                  <span>실거래율 91% 이상</span>
                </div>
                <div>
                  <b>프로 경매</b>
                  <span>평가사 진단, 비대면</span>
                </div>
                <div>
                  <b>셀프 경매</b>
                  <span>직접 확인 후 거래</span>
                </div>
              </div>
              <div className="foot">
                <div className="k">
                  <span>
                    <b>230,000+</b>누적 경매
                  </span>
                  <span>
                    <b>8,000+</b>누적 딜러
                  </span>
                </div>
                <a className="pill" href="https://www2.car-auction.co.kr/" target="_blank" rel="noopener noreferrer">
                  카옥션 방문 <span className="ar">↗</span>
                </a>
              </div>
            </article>
            <div className="pf-side">
              <div className="pf-next">
                <span className="label">Coming next</span>
                <h4>
                  다음 포트폴리오를
                  <br />
                  찾고 있습니다
                </h4>
                <p>자동차 유통 밸류체인 안의 팀이라면 제안을 보내 주세요.</p>
                <a className="pill ghost" href="#contact" style={{ justifySelf: 'start' }}>
                  제안하기 <span className="ar">→</span>
                </a>
              </div>
              <div className="pf-quote">
                “새로워진 카옥션, 경매의 기준을 다시 만듭니다.”<small>카옥션 브랜드 슬로건</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="ir">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Investor relations</span>
              <h2>IR · 공시</h2>
            </div>
            <p>주주총회 소집 통지와 결과, 공고, 공시 자료를 게시합니다. 모든 주주께 같은 날 동일한 정보를 제공합니다.</p>
          </div>
          <Suspense fallback={<IrSkeleton />}>
            <IrSummary />
          </Suspense>
        </div>
      </section>

      <section className="sec" id="news" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Newsroom</span>
              <h2>소식</h2>
            </div>
          </div>
          <div className="news">
            <a href="#news">
              <div className="thumb t1">
                <div />
                <span>카옥션</span>
              </div>
              <p className="meta">2026.09.22</p>
              <h4>새로워진 카옥션, 경매의 기준을 다시 만듭니다</h4>
            </a>
            <a href="#news">
              <div className="thumb t2">
                <div />
                <span>카동</span>
              </div>
              <p className="meta">2026.07.08</p>
              <h4>카동, 지주회사 체제 전환 완료</h4>
            </a>
            <a href="#news">
              <div className="thumb t3">
                <div />
                <span>카옥션</span>
              </div>
              <p className="meta">2026.05.14</p>
              <h4>누적 경매 23만 건 돌파</h4>
            </a>
          </div>
        </div>
      </section>

      <section id="contact" style={{ paddingBottom: 16 }}>
        <div className="wrap">
          <div className="cta-big">
            <h2>
              Let’s build
              <br />
              the <span className="serif">next</span> standard.
            </h2>
            <div className="row">
              <dl>
                <dt>주소</dt>
                <dd className="ph">카동 본사 주소 입력</dd>
                <dt>IR 문의</dt>
                <dd className="ph">ir@cardong.co.kr (예시)</dd>
                <dt>대표전화</dt>
                <dd className="ph">02-000-0000 (예시)</dd>
                <dt>카옥션</dt>
                <dd>고객센터 1661-5777</dd>
              </dl>
              <a className="pill" href="mailto:ir@cardong.co.kr">
                투자 · 제휴 문의 <span className="ar">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Latest board posts, read from SQLite on every request.
async function IrSummary() {
  await connection()
  const { rows } = listPosts({ pageSize: 5 })
  const meeting = latestByCategory('주주총회')
  return (
    <div className="ir">
      <aside className="agm">
        <span className="lbl">최근 주주총회 공고</span>
        {meeting ? (
          <>
            <div className="d">{formatDate(meeting.created_at).slice(5)}</div>
            <h4>{meeting.title}</h4>
            <p>{formatDate(meeting.created_at)} 게시</p>
            <Link className="pill" href={`/ir/${meeting.id}`}>
              공고 보기 <span className="ar">→</span>
            </Link>
          </>
        ) : (
          <h4>등록된 주주총회 공고가 없습니다.</h4>
        )}
      </aside>
      <div className="board">
        <PostRows rows={rows} emptyText="아직 등록된 게시글이 없습니다." />
        <div className="more">
          <Link className="pill ghost sm" href="/ir">
            전체 게시글 보기 <span className="ar">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function IrSkeleton() {
  return (
    <div className="ir">
      <aside className="agm">
        <span className="lbl">최근 주주총회 공고</span>
      </aside>
      <div className="board">
        <p className="empty">게시글을 불러오는 중입니다.</p>
      </div>
    </div>
  )
}
