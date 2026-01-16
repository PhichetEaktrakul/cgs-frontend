export default function ModalTOS({handleAgreement}) {
  return (
    <>
      {/* ----------- TOS Agreement Modal ----------- */}
      <dialog id="tos_modal" className="modal">
        <div className="modal-box">
          <p className="font-bold text-xl mb-2.5">ข้อกำหนดการใช้บริการ</p>
          <textarea
            className="resize-none w-[100%] h-[400px]"
            defaultValue={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi felis sapien, euismod eget dolor eget, condimentum tincidunt leo. Cras fermentum erat vel sollicitudin rhoncus. Maecenas posuere tortor purus, eget ornare lacus finibus sit amet. Donec tincidunt maximus justo quis varius. Nam tristique sapien pulvinar elit fringilla maximus. Ut posuere odio ac commodo imperdiet. Curabitur quis placerat sapien. Aliquam maximus dolor odio, sed fringilla sem bibendum eu. Sed ultrices justo sollicitudin blandit volutpat. Sed condimentum orci id congue lobortis. Curabitur sit amet enim id arcu sollicitudin ornare non non elit. Sed ut dapibus enim, et pellentesque eros. In ut est et purus iaculis ullamcorper. Cras commodo, est viverra dapibus ultrices, urna metus interdum risus, nec malesuada dolor erat sit amet magna. Cras id turpis ut ligula vulputate ultricies. Morbi facilisis, felis vitae laoreet pulvinar, lectus erat finibus arcu, tincidunt placerat nunc nibh nec velit. Vivamus facilisis maximus ornare. Vestibulum eu condimentum odio, vel dapibus tellus. Ut a nibh risus. Maecenas tristique varius nisi, vitae egestas mi mollis a. Maecenas consequat tellus et est dictum tincidunt. Proin aliquam, magna at lacinia ullamcorper, mauris nibh porttitor augue, in varius libero augue quis neque. Proin porttitor tristique justo, et imperdiet sapien mollis dignissim. Sed ultricies scelerisque ligula. Nunc ultrices quam vel ex consectetur imperdiet. In scelerisque risus vitae elementum faucibus. Sed vel ante sit amet tortor molestie viverra id nec neque. Fusce erat ipsum, porta id dapibus eu, tristique nec nibh. Vivamus eu posuere risus. Nam faucibus porta arcu, ut posuere ipsum gravida sed. Nam vulputate, leo at blandit feugiat, elit libero mollis risus, sit amet suscipit erat lectus eget dui. Donec neque sem, tristique sed ligula hendrerit, molestie porttitor neque. Aenean in leo ut enim elementum iaculis. Duis dapibus egestas magna, eu molestie risus mattis at. Praesent tempor dignissim eros. Quisque dapibus vitae augue sagittis sagittis. Etiam dictum, lacus nec feugiat ullamcorper, turpis ipsum fringilla lacus, rutrum finibus augue urna vitae nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis commodo vitae orci varius mollis. Ut vel sem et nulla rutrum faucibus. Proin in orci turpis. Fusce finibus a tortor eu sodales. Sed dignissim nisi vitae dolor euismod, viverra pellentesque orci pulvinar. Mauris sollicitudin nisl non lectus fermentum laoreet. Morbi placerat metus in diam pulvinar semper. Aenean tincidunt velit arcu, sit amet dignissim leo auctor at. Fusce facilisis sed neque vitae varius. Suspendisse finibus est tellus, ut blandit urna vestibulum vitae. Nulla tortor mauris, cursus euismod lacus ac, laoreet porttitor nibh. Nulla facilisi. Integer aliquet efficitur ligula, nec aliquet nulla scelerisque non. Vestibulum accumsan risus sit amet elementum lacinia.`}
            disabled
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2 bg-transparent border-[#2a53b3fc] text-[#2a53b3fc] rounded-full">ไม่ยอมรับ</button>
              <button type="button" className="btn ml-2 px-6 bg-[#2a53b3fc] text-white rounded-full" onClick={handleAgreement}>ยอมรับ</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
