# Weather Check
🌦 https://weather-check-beta.vercel.app

> Weather Check는 데이터 정합성(Consistency)과 사용자 경험에 집중한 날씨 정보 서비스입니다.
상태 동기화 문제 해결과 최적화된 아키텍처 설계를 집중적으로 고민했습니다.

---

## 프로젝트 실행 방법

### 1. 환경 변수 설정
루트 디렉토리에 `.env` 파일을 생성하고 OpenWeatherMap API 키를 설정합니다.

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### 2. 설치 및 실행

```bash
npm install
npm run dev
```

---

## 핵심 기술적 의사결정 

### 1. 상태 동기화와 SSOT
메인 화면과 사이드바 등 여러 컴포넌트에서 데이터가 불일치하는 문제를 방지하기 위해 단방향 데이터 흐름을 강제했습니다.

- 문제 해결: Props Drilling으로 인한 구형 데이터 참조 문제를 발견하고, Context API를 통한 직접 구독(Direct Subscription) 패턴을 도입했습니다.
- 결과: `FavoritesProvider`가 전역 상태의 유일한 원천이 되며, 데이터 변경 시 구독 중인 모든 UI가 렌더링 사이클에 맞춰  동기화됩니다.

### 2. UX 완결성을 고려한 CRUD 구현

- 인라인 편집
    - 별명 수정 시 제자리에서 편집 가능합니다.

- 낙관적 UI
    - 로컬 스토리지의 입출력 대기시간을 사용자에게 노출하지 않습니다. 상태를 먼저 갱신하고 스토리지를 비동기로 동기화하여, 사용자는 지연 없는 UI 반응을 제공합니다.

### 3. FSD (Feature Sliced Design) 기반의 응집도 설계
단순한 파일 분리가 아닌 변경의 빈도와 책임의 범위에 따라 아키텍처를 설계했습니다.

- 도메인 응집도 강화: `entities/location` 레이어에 검색, 식별, 표시에 필요한 모든 로직(`parts`, `displayLabel`)을 집중시켜 비즈니스 로직의 파편화를 막았습니다.
- API와 DTO의 물리적 배치: API 호출 함수와 반환 타입(DTO)을 `shared/api` 내 동일 파일에 배치하여 코드 수정 시 문맥 전환 을 최소화했습니다.

---

##  성능 최적화

### 1. 캐싱 전략
TanStack Query를 활용해 데이터 특성에 맞는 캐싱 생명주기를 설계했습니다.

- 불변 데이터 (Geocoding): 행정구역 좌표는 변하지 않으므로 `staleTime: Infinity`를 적용하여 중복 네트워크 호출을 막았습니다.
- 실시간 데이터 (Weather): 10분의 staleTime을 적용하여 서버 부하 감소와 최신 정보 제공의 균형을 맞추고 잦은 페이지 전환에도 부드러운 화면을 제공합니다.

### 2. 한국 행정구역 검색 폴백(Fallback) 시스템
API의 낮은 인식률을 보완하기 위해 클라이언트 사이드에서 보정 로직을 수행합니다.

- Data Fallback: `korea_districts.json`을 활용한 3단계 매칭 (정확 일치 → 접미사 제거 재검색 → 인메모리 캐시 조회)을 통해 검색 실패율을 낮췄습니다.
- UX 보정: 검색어가 부분적으로만 일치해도 행정 계층 가중치를 통해 광역시/도 등 사용자가 의도했을 확률이 높은 지역을 우선 노출합니다.

### 3. One Call API 정규화 (Normalization)
복잡한 중첩 구조의 API 응답을 프론트엔드에서 바로 사용하기 부적합하다고 판단하여, 응답 수신 즉시 정규화를 수행합니다. 이를 통해 컴포넌트 레벨에서는 비즈니스 로직 없이 순수하게 렌더링에만 집중할 수 있는 환경을 만들었습니다.

---

## 기술 스택

- **Build**: Vite
- **Language**: TypeScript
- **Framework**: React 18, Vite
- **Architecture**: Feature Sliced Design (FSD)
- **State Management**: Tanstack Query v5 (Server), Context API (Client)
- **Styling**: Tailwind CSS
